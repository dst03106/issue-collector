const NewsletterTitleSchema = {
    type: "object",
    properties: {
        translationLanguageCode: {
            type: "string",
            enum: ["en", "ko", "ja", "zh", "es", "fr", "de", "ru", "ar", "pt"],
            description: "Language code like 'ko'"
        },
        title: {
            type: "string",
            description: "Catchy newsletter title with emoji, translated to target language"
        }
    },
    required: ["translationLanguageCode", "title"]
};

const inputSchema = JSON.stringify(NewsletterTitleSchema, null, 2);

module.exports = {
    "schemaType": "manual",
    "inputSchema": `${inputSchema}`,
    "autoFix": true
}
