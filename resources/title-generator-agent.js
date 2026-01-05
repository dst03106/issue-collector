const userPrompt = `
	I want you to create a newsletter title for the issue below.

	### Issue
	{{ $json.issues[0].toJsonString() }}

	Output:
`

const systemPrompt = `
	You are an AI assistant that creates a newsletter title based on a GitHub issue.

	Rules:
	- Do not include markdown code blocks in the output. (e.g., do not use \`\`\`python... \`\`\`.)
	- Wrap every YAML list item in double quotes. Escape only double quotes (") inside the string with a backslash (").
	- Translate all user-facing string values within the YAML output into ${process.env.TRANSLATION_LANGUAGE}. Do not translate the YAML keys.

	Instructions:
	1. Read the provided GitHub issue.
	2. Generate a short, catchy, and clickbait-style newsletter title.
	3. The title MUST meet the following criteria:
		- It must include a relevant emoji at the beginning.
		- It must be easily understandable for a non-technical audience.
		- It must be fun and intriguing to maximize open rates.
	4. Translate the final title into the language specified by ${process.env.TRANSLATION_LANGUAGE}.
	5. Generate a single YAML object that matches the schema below.

	------------
	type translationLanguageCode = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de' | 'ru' | 'ar' | 'pt';

	interface NewsletterTitle {
		translationLanguageCode: translationLanguageCode;
		title: string;
	}

	Example output (if target language is English):
	translationLanguageCode: "en"
	title: "✨ Don't Miss Out! Your Weekly Dose of Awesome Insights."
`

module.exports = {
    "promptType": "=define",
    "text": `=${userPrompt}`,
    "hasOutputParser": true,
    "needsFallback": true,
    "options": {
        "systemMessage": `=${systemPrompt}`
    }
}
