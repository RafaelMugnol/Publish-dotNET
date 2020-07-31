const azdev = require("azure-devops-node-api");


const orgUrl = "https://dev.azure.com/{your_organization}";
const config = require('./config.json');

class publishProcess {
	async queue(version, buildVersion){
		//inicia
		console.log("Iniciando...");

		let authHandler = azdev.getPersonalAccessTokenHandler(config.AzureToken);
		let connection = new azdev.WebApi(orgUrl, authHandler);
		let buildApi = await connection.getBuildApi();
	  
		const branchName = version === "MAIN" ? version : "VERSOES/" + version;
		const baseVersion = version === "MAIN" ? "2020.7.1" : version;
		const publishPath = version;
		
		const buildDefinition = {
		  definition: { id: 529 },
		  parameters: `{
			"build.branchName":"${branchName}",
			"build.baseVersion":"${baseVersion}",
			"build.publishPath":"${publishPath}",
			"build.version":"${buildVersion}"
		  }`
		};
	  
		var buildResponse = await buildApi.queueBuild(buildDefinition, "MercanetWeb");
	  
		console.log("Build queued: " + buildResponse.id);
		return buildResponse.id;
	}
}

module.exports = new publishProcess();