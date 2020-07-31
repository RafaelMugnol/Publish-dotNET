const Pack = require('../models/pack');
const PublishProcess = require('../publishProcess')
const PackHelper = require('../helpers/packHelper')

class PublishController {
	async start(req, res) {
		const id = req.body.id;

		let pack = await Pack.findById(id);
		//PackHelper.updatePack(pack, { status: PackHelper.statusEnum.FILA }, req.io);

		//await sleep(1000);

		updatePublish(req, pack);

		return res.send({});
	}

	async list(req, res) {
		const packs = await Pack.find();

		let retorno = [];

		packs.forEach(element => {
			retorno.push(PackHelper.convertPack(element));
		});

		return res.send({ packs: retorno })
	}

	async add(req, res) {
		/*const pack = await Pack.create({version: "MIAN",
		   path: "//MERCCXSAP01/Public/Publicacao_Rafael/MAIN",
		   status: 0 });*/

		const pack = await Pack.create(req.body);

		return res.send({ pack: PackHelper.convertPack(pack) })
	}

	async buildFinish(req, res) {
		console.log(req.body);
		
		return res.send();
	}
}

async function updatePublish(req, pack) {
	//console.log("updatePublish: " + pack.version);
	//PackHelper.updatePack(pack, { status: PackHelper.statusEnum.PROCESSANDO, getDate: new Date() }, req.io);

	//await sleep(1000);
	var errorMessage = "";
	let buildId = 0;

	if (pack.buildVersion === undefined)
		pack.buildVersion = 0;

	pack.buildVersion = pack.buildVersion + 1;


	try {	
		buildId = await PublishProcess.queue(pack.version, pack.buildVersion);
	}
	catch(erro) {
		errorMessage = erro;
	}

	PackHelper.updatePack(pack, { 
		status: errorMessage == "" ? PackHelper.statusEnum.FILA : PackHelper.statusEnum.ERRO, 
		errorMessage,
		buildId,
		buildVersion: pack.buildVersion,
		getDate: new Date()
	}, req.io);
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

module.exports = new PublishController();