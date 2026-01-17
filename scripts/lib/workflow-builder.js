const fs = require('fs');
const path = require('path');
const { z } = require('zod');

/**
 * 노드 이름을 kebab-case로 변환
 * @param {string} name - 변환할 노드 이름
 * @returns {string} kebab-case 문자열
 */
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * resources 폴더의 모든 파일을 읽어서 Map으로 반환
 * @param {string} resourcesDir - resources 디렉토리 경로
 * @returns {Map<string, any>} 파일명(확장자 제외) -> 파일 내용
 */
function readResourceFiles(resourcesDir) {
  const resourceMap = new Map();

  try {
    const files = fs.readdirSync(resourcesDir);
    
    for (const file of files) {
      const filePath = path.join(resourcesDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext);
        try {
           const moduleExports = require(filePath);

           const extractFunctionBody = (functionString) => {
             const match = functionString.match(/\{([\s\S]*)\}/m);
             return match ? match[1].split('\n').map(line => line.replace(/^(\t|  )/, '')).join('\n').trim() : '';
           };

           const jsCodeSchema = z.object({
             jsCode: z.string().transform(extractFunctionBody)
           });

           const nestedCodeSchema = z.object({
             code: z.union([
               z.object({
                 execute: z.object({
                   code: z.string().transform(extractFunctionBody)
                 })
               }),
               z.object({
                 supplyData: z.object({
                   code: z.string().transform(extractFunctionBody)
                 })
               })
             ])
            });

          const getResource = (resource) => {
            const jsCodeResult = jsCodeSchema.safeParse(resource);
            if (jsCodeResult.success) {
              return { ...resource, ...jsCodeResult.data }; 
            }

            const nestedResult = nestedCodeSchema.safeParse(resource);
            if (nestedResult.success) {
              return { ...resource, ...nestedResult.data };
            }

            return resource;
          };

          if (moduleExports && Object.keys(moduleExports).length > 0) {
            resourceMap.set(nameWithoutExt, getResource(moduleExports));
          }
        } catch (error) {
          console.warn(`  ⚠️  ${file} 파일을 import하는 중 오류 발생:`, error.message);
        }
      }
    }
    
    console.log(`✓ ${resourceMap.size}개의 리소스 파일을 읽었습니다.`);
    return resourceMap;
  } catch (error) {
    console.error('리소스 폴더를 읽는 중 오류 발생:', error.message);
    return resourceMap;
  }
}

/**
 * workflow를 빌드하는 메인 함수
 * @param {Object} config - 빌드 설정
 * @param {string} config.workflowPath - n8n.json 파일 경로
 * @param {string} config.resourcesDir - resources 디렉토리 경로
 * @param {string} config.outputPath - workflow.json 출력 경로
 * @returns {Object} 빌드 결과
 */
function buildWorkflow(config) {
  const { workflowPath, resourcesDir, outputPath } = config;
  
  console.log('🔨 n8n workflow 빌드를 시작합니다...\n');

  if (!fs.existsSync(workflowPath)) {
    const error = `❌ n8n.json 파일을 찾을 수 없습니다: ${workflowPath}`;
    console.error(error);
    return { success: false, error };
  }

  try {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    const workflow = JSON.parse(workflowContent);

    // 리소스 파일들 읽기
    const resourceMap = readResourceFiles(resourcesDir);

    if (resourceMap.size === 0) {
      console.warn('⚠️  리소스 파일이 없습니다. 원본 workflow를 그대로 출력합니다.');
    }

    // 각 노드 순회하며 빈 필드 채우기
    let updatedCount = 0;
    
    for (const node of workflow.nodes || []) {
      const nodeName = node.name;
      const kebabName = toKebabCase(nodeName);
     
      if (node.parameters && resourceMap.has(kebabName)) {
          const resourceContent = resourceMap.get(kebabName);
          node.parameters = resourceContent;
          console.log(`  ✓ "${nodeName}" 노드의 파라미터를 업데이트했습니다. (${kebabName})`);
          updatedCount++;
      }
    }

    // workflow.json으로 출력
    fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2), 'utf8');

    console.log(`\n✅ 빌드 완료!`);
    console.log(`   - ${updatedCount}개의 노드를 업데이트했습니다.`);
    console.log(`   - 결과: ${outputPath}`);

    return { 
      success: true, 
      outputPath, 
      updatedCount 
    };
  } catch (error) {
    console.error('❌ 빌드 중 오류 발생:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

module.exports = { buildWorkflow, toKebabCase, readResourceFiles };
