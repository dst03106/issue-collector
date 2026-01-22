const getFreeModels = function() {
	// Based on OpenRouter market share rankings
	const RELIABLE_PROVIDER = [
			'google', 'anthropic', 'openai',
			'x-ai', 'deepseek', 'xiaomi',
			'qwen', 'mistralai', 'z-ai'
	];

	function isReliableProvider(modelInfo) {
		const provider = modelInfo.id.split("/")[0];
		return RELIABLE_PROVIDER.includes(provider)
	}

	function isFreeModel(modelInfo) {
		return modelInfo.pricing.prompt === "0" && modelInfo.pricing.completion === "0" 
	}

	var freeModels = [];
	var reliableModels = [];
	for (const item of $input.first().json.data) {
		if (isFreeModel(item)) {
			freeModels.push(item)
			if (isReliableProvider(item)) {
				reliableModels.push(item)
			} 
		}
	}

	var selectedModels = reliableModels || freeModels; 
	selectedModels.sort((a, b) => b.created - a.created);
	return selectedModels.map(model => {
		return { id: model.id}
	}) 
};

module.exports = {
	"jsCode": getFreeModels.toString()
};
