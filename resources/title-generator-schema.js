const titleGeneratorSchema = () => {
	return {
			title: "newsletter_title_output",
			description: "Generated newsletter title based on GitHub issue",
			type: "object",
			properties: {
					translationLanguageCode: {
							type: "string",
							description: "Language code"
					},
					title: {
							type: "string",
							description: "Catchy newsletter title with emoji, translated to target language"
					}
			},
			required: ["translationLanguageCode", "title"]
	};
};

module.exports = {
	"jsCode": titleGeneratorSchema.toString()
};
