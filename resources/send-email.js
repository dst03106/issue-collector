module.exports = {
    "fromEmail": process.env.EMAIL,
    "toEmail": process.env.EMAIL,
    "subject": "=[Issue Report] {{ $('Load Repo Info').item.json.owner }}/{{ $('Load Repo Info').item.json.name }} - {{ $('Title Generator Agent').item.json.output.title }}",
    "html": "={{ $('convert MJML to HTML').item.json.htmlOutput.html }}",
    "options": {}
};
