const { execFile } = require('child_process');

function executeWorkflow({
	translation_language,
	repo,
	email,
}) {
	const options = {
		env: {
			...process.env,
			TRANSLATION_LANGUAGE: translation_language,
			REPO: repo,
			EMAIL: email,
		},
		timeout: 300000, // 5분 타임아웃 (밀리초)
		maxBuffer: 1024 * 1024, // 1MB 버퍼
	};
	return new Promise((resolve, reject) => {
		execFile('./scripts/entrypoint.sh', [], options, (error, stdout, stderr) => {
			if (stderr || error) {
				reject({ error, stderr, stdout });
			} else {
				resolve({ error, stderr, stdout }); 
			}
		});
	});
}

exports.handler = async (event) => {
	console.log(event);
	const config = {
		translation_language: event.translation_language,
		repo: event.repo,
		email: event.email,
	};
		await executeWorkflow(config)
			.then(({ error, stderr, stdout }) => {
				if (stdout) console.log(`[STDOUT] ${stdout}`);
				if (stderr) console.error(`[STDERR] ${stderr}`);
				if (error) throw new Error(`Workflow failed: ${error?.message || stderr}`);
			})
			.catch((err) => {
				console.error(`[STDOUT] ${err.stdout || ''}`);
				console.error(`[STDERR] ${err.stderr || ''}`);
				console.error(`Workflow failed: ${err.error?.message || err}`);
				throw err;
			});
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Success' }),
		};
	}
