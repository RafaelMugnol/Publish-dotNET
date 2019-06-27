const Pack = require('../models/pack');
const PublishProcess = require('../publishProcess')

class PublishController {
	async start(req, res) {
		const id = req.body.id;

		let pack = await Pack.findById(id);
		updatePack(pack, { status: statusEnum.FILA }, req);

		const packs = await Pack.find();
		for (const i in packs) {
			const element = packs[i];
			if (element.id !== pack.id && (element.status == statusEnum.FILA || element.status == statusEnum.PROCESSANDO)) 
				return res.send({});
		}

		await sleep(1000);

		updatePublish(req, pack);

		return res.send({});
	}

	async list(req, res) {
		const packs = await Pack.find();

		let retorno = [];

		packs.forEach(element => {
			retorno.push(convertPack(element));
		});

		return res.send({ packs: retorno })
	}

	async add(req, res) {
		/*const pack = await Pack.create({version: "MIAN",
		   path: "//MERCCXSAP01/Public/Publicacao_Rafael/MAIN",
		   status: 0 });*/

		const pack = await Pack.create(req.body);

		return res.send({ pack: convertPack(pack) })
	}
}

async function updatePublish(req, pack) {
	console.log("updatePublish: " + pack.version);
	updatePack(pack, { status: statusEnum.PROCESSANDO, getDate: new Date() }, req);

	await sleep(1000);
	var errorMessage = "";
	
	try {	
		await PublishProcess.inicia(pack.version);
	}
	catch(erro) {
		errorMessage = erro;
	}

	updatePack(pack, { status: errorMessage == "" ? statusEnum.DISPONIVEL : statusEnum.ERRO, errorMessage }, req);

	console.log("FIM updatePublish: " + pack.version);
	
	const packs = await Pack.find();

	for (const i in packs) {
		const element = packs[i];
		if (element._id != pack._id && element.status == statusEnum.FILA) {
			updatePublish(req, element);
			return;
		}
	}
}

async function updatePack(pack, values, req) {
	await Pack.updateOne({ "_id": pack._id }, values);

	//const pack = { ...pack, ...values };//entender pq isso nao funciona

	if (values.status) pack.status = values.status;
	if (values.getDate) pack.getDate = values.getDate;
	if (values.errorMessage) pack.errorMessage = values.errorMessage;

	req.io.emit("updatePack", convertPack(pack));
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

convertPack = (pack) => {
	return {
		id: pack._id,
		version: pack.version,
		path: pack.path,
		status: pack.status,
		date: pack.getDate,
		errorMessage: pack.errorMessage
	}
}

statusEnum = {
	NAO_PUBLICADO: 0,
	FILA: 1,
	PROCESSANDO: 2,
	DISPONIVEL: 3,
	ERRO: 4
};

module.exports = new PublishController();