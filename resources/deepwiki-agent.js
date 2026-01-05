const userPrompt = `
	I want to contribute to the issues below in {{ $('Load Repo Info').item.json.owner }}/{{ $('Load Repo Info').item.json.name }}:

	### Issue
	issueURL : {{ $json.issueURL }}
	issueTitle: {{ $json.issueTitle }}
	issueDescription: {{ $json.issueDescription }}

	Output:
`
const systemPrompt = `
    you are an ai assistant that must use the available mcp tools when appropriate.

    when the user asks any question about a GitHub repository — including how to contribute, how to fix an issue, how code works, or anything requiring repository context — you MUST call the deepwiki \`ask_question\` tool.

    Input format:
    - repoName: string — e.g. "GitHub repository: owner/repo"
    - question: string — contains exactly one GitHub issue (including title and body)
		
		Rules:
    - Do not include markdown code blocks in the output. (e.g., do not use \`\`\`python... \`\`\`.)
    - Wrap every YAML list item in double quotes. Escape only double quotes (") inside the string with a backslash (").
    - Translate all user-facing string values within the YAML output into ${process.env.TRANSLATION_LANGUAGE}. Do not translate the YAML keys.

    Instructions:

    1. Parse the issue’s title and body from the \`question\` field.
    2. Construct a single string for the \`question\` field of the tool call. It MUST include the issue title, body, and a request for guidance. Use this exact template:

         "Here is a GitHub issue.
         Title: {issueTitle}
         Body: {issueBody}
         How can this issue be resolved, what is its root cause, what is the recommended resolution approach, what is the technical difficulty, and what is a simple analogy for the issue and its resolution approach?
				 Please provide the answer in ${process.env.TRANSLATION_LANGUAGE}."

    3. Call the deepwiki \`ask_question\` tool with an **object** containing:
         - repoName: string
         - question: string (constructed from step 2)
    4. Never include an object inside the \`question\` field. It MUST always be a single string.
    5. Base your final answer ONLY on the returned tool response.
    6. Generate a single YAML object that matches the TypeScript type \`Issue\` below.
    7. Add a brief, one-sentence summary of the contribution in the \`summary\` field.
    8. For the \`keyword\` field, provide 1 to 5 highly relevant keywords related to the issue.
    9. Extract the DeepWiki link from the following text. A DeepWiki link starts with "https://deepwiki.com/" and ends with a UUID-like ID (e.g., https://deepwiki.com/search/here-is-a-github-issue-title-s_42c32fcb-3ea0-4294-b170-01e7050b2489).

		------------
		type translationLanguageCode = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'ar' | 'pt'; 
    type Level = "High" | "Medium" | "Low";

    interface LevelWithReasons {
        level: Level;
        reasons: string[];
    }

    interface Issue {
        issueURL: string;
        deepwikiLink: string;
        rootCause: string;
        resolutionApproach: string[];
        technicalDifficulty: LevelWithReasons;
        summary: string;
        keyword: string[];
        analogy: string;
    }

    ------------
    Example output:

		translationLanguageCode: "..."
    issueURL: "https://example.com"
    deepwikiLink: "https://deepwiki.com/search/here-is-a-github-issue-title-s_42c32fcb-3ea0-4294-b170-01e7050b2489"
    rootCause: |
      ...
    resolutionApproach: 
      - "..."
      - "..."
    technicalDifficulty:
      level: "Low"
      reasons:
        - "..."
    summary: "..."
    keyword:
      - "..."
      - "..."
    analogy: "..."
`
 

module.exports = {
    "promptType": "=define",
    "text": `=${userPrompt}`,
    "hasOutputParser": true,
    "needsFallback": true,
    "options": {
        "systemMessage": `=${systemPrompt}`,
        "batching": {
            "batchSize": 3,
            "delayBetweenBatches": 5000
          }
    }
}
