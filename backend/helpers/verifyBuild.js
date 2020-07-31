const Pack = require('../models/pack');
const PackHelper = require('../helpers/packHelper')
const azdev = require("azure-devops-node-api");
const bi = require("azure-devops-node-api/interfaces/BuildInterfaces");

const orgUrl = "https://dev.azure.com/{your_organization}";
const config = require('../config.json');

async function verifyBuildFinish(io) {
    console.log("Verificando");
    

    const packs = await Pack.find();
    const packsInProcess = await getByStatus(packs, PackHelper.statusEnum.PROCESSANDO);

    if (packsInProcess.length > 0) {

        await updatePackByBuild(packsInProcess[0], io);

    }
    else {
        const packsInQueue = await getByStatus(packs, PackHelper.statusEnum.FILA);

        for (const pack of packsInQueue) {
            updatePackByBuild(pack, io);
        }
    }
}

function getByStatus(packs, status) {
    let packsReturn = [];

    for (const pack of packs) {
        if (pack.status == status)
            packsReturn.push(pack);
    }

    return packsReturn;
}

async function updatePackByBuild(pack, io) {
    let authHandler = azdev.getPersonalAccessTokenHandler(config.AzureToken);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    let buildApi = await connection.getBuildApi();

    let build = await buildApi.getBuild("MercanetWeb", pack.buildId);

    console.log(`Build ${pack.buildId}`);

    switch (build.status) {
        case bi.BuildStatus.Completed:
            console.log(`Finalizado`);
            
            let status = PackHelper.statusEnum.DISPONIVEL
            let errorMessage = "";

            if (build.result !== bi.BuildResult.Succeeded){
                status = PackHelper.statusEnum.ERRO; 
                errorMessage = "Erro no build, abra o DevOps para verificar."
            }

            PackHelper.updatePack(pack, { status, errorMessage }, io);
            break;

        case bi.BuildStatus.InProgress:
            console.log(`Iniciando`);
            PackHelper.updatePack(pack, { status: PackHelper.statusEnum.PROCESSANDO }, io);
            break;
    }

    console.log("Status: " + bi.BuildStatus[build.status]);
    console.log("Result: " + bi.BuildStatus[build.result]);
    console.log("");
}


module.exports = verifyBuildFinish;