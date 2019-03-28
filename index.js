const alert = require("./helpers/alert");
const question = require("./actions/question");
const get = require("./actions/get");
const publish = require("./actions/publish");
const delivery = require("./actions/delivery");

async function main(){
	//inicia
	console.log("Iniciando...");
	alert("Tranferência iniciada.");

	//questiona a versão 
	const version  = question();
	const fullVersion = getFullVersion(version);

	//get no tfs
	await convertToAsync(get, fullVersion);

	//compila e publica localmente
	await convertToAsync(publish, fullVersion);

	//apaga web.config, transfere para o public e apaga a local
	delivery(version, fullVersion, () => { alert("Tranferência finalizada!"); });
	
	console.log("Finalizado total! \nVersão: " + version);
}

main();


function getFullVersion (versionBase){
	if(versionBase != "MAIN")
		versionBase += ".1";

	return versionBase;
}

//https://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises
function convertToAsync(func, ...params){
	return new Promise((resolve, reject) => {
        func(...params, () => {
			resolve();
        });
    });
}