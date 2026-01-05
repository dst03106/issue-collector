const inputSchema = `{
	"type": "object",
	"properties": {
		"translationLanguageCode": {
			"type": "string",
			"enum": ["en", "ko", "ja", "zh", "es", "fr", "de", "ru", "ar", "pt"]
		},
		"title": {
			"type": "string"
		}
	},
	"required": [
		"translationLanguageCode",
		"title"
	]
}`;

module.exports = {
	"schemaType": "manual",
	"inputSchema": `${inputSchema}`,
	"autoFix": true
}
