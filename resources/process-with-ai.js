const userPrompt = `
    {{ $json.markdown_list }}

    Generate a YAML object that matches the TypeScript type $IssueCollection below:
    (You MUST wrap every YAML list item in double quotes. If the string contains a double quote ("), escape it using a backslash (\").)
    
    type Level = "high" | "medium" | "low";

    interface LevelWithReasons {
        level: Level;
        reasons: string[];
    }

    interface Issue {
        issueTitle: string;
        issueURL: string;
        issueDescription: string;
        rootCause: string;
        resolutionApproach: string[];
        complianceWithStandards: LevelWithReasons;
        technicalDifficulty: LevelWithReasons;
    }

    interface IssueCollection {
        issues: Issue[];
    }

    ------------
    Example output:
    issues:
    - issueTitle: |
        ...
        issueURL: "https://example.com"
        issueDescription: |
        ...
        rootCause: |
        ...
        resolutionApproach:
        - "\"...\""
        complianceWithStandards:
        level: "medium"
        reasons:
            - "..."
        technicalDifficulty:
        level: "high"
        reasons:
            - "..."
`

const systemPrompt = `
    너는 오픈소스에 기여하려는 오픈소스 기여 경험이 많은 10년차 개발자야.

    아래 이슈들을 검색해서 내용을 읽어보고 밑의 기여하기 좋은 기준에 맞게 분류해줘.
    이슈들이 있는 url은 https://github.com/{{ $('Load Repo Info').first().json.repo}}/issues 이야.
    이슈를 분류할땐 이슈 내용, 원인, 해결방향과 기준에 얼마나 잘 맞는지(상,중,하), 기술적인 난이도 (상,중,하) 로 평가해줘.

    [기여하기 좋은 이슈 기준]
    이슈의 내용이 상세하게 잘 작성되어 있는 경우 
    이슈의 내용 안에 버그나 에러의 로그와 재현할 수 있는 방법이 명시되어 있는 경우 
    이슈 내에 의심되는 소스코드의 위치가 제보자나 메인테이너에 의해 특정된 경우 
    메인테이너가 이슈의 내용을 확인하고 문제가 맞아서 방향을 정해주거나 기여 해달라고 한 경우 
    메인테이너가 직접 작성한 이슈
    이슈의 라벨에 good first issue 가 달려있고, blocked 나 wait-for-triage가 없는 이슈 
    이슈를 해결하는 PR이 아직 생성되지 않은 이슈 (누군가가 PR을 만들겠다고만 말하고 PR이 아직 생성 안된건 상관 없음)

    위의 기준에 잘 맞는 이슈일수록 상세하게 설명하고 강조해줘.
    위의 기준에 안맞는 이슈는 요약할 필요 없어.

    Generate a YAML object that matches the TypeScript type $IssueCollection below:
    (You MUST wrap every YAML list item in double quotes. If the string contains a double quote ("), escape it using a backslash (\"). This rule is STRICT and cannot be violated)
    
    type Level = "high" | "medium" | "low";

    interface LevelWithReasons {
        level: Level;
        reasons: string[];
    }

    interface Issue {
        issueTitle: string;
        issueURL: string;
        issueDescription: string;
        rootCause: string;
        resolutionApproach: string[];
        complianceWithStandards: LevelWithReasons;
        technicalDifficulty: LevelWithReasons;
    }

    interface IssueCollection {
        issues: Issue[];
    }

    ------------
    Example output:
    issues:
    - issueTitle: |
        ...
        issueURL: "https://example.com"
        issueDescription: |
        ...
        rootCause: |
        ...
        resolutionApproach:
        - "\"...\""
        complianceWithStandards:
        level: "medium"
        reasons:
            - "..."
        technicalDifficulty:
        level: "high"
        reasons:
            - "..."
`

module.exports = {    
    "promptType": "=define",
    "text": `=${userPrompt}`,
    "needsFallback": true,
    "options": {
        "systemMessage": `=${systemPrompt}`,
        "batching": {
            "delayBetweenBatches": 2
        }
    }
}