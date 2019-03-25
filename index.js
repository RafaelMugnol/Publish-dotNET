const alert = require("./helpers/alert");
const question = require("./actions/question");
const get = require("./actions/get");
const publish = require("./actions/publish");
const delivery = require("./actions/delivery");

//inicia
console.log("Iniciando...");
alert("Tranferência iniciada.");

//questiona a versão 
const version  = question();
const fullVersion = getFullVersion(version);

//get no tfs
get(fullVersion, () => {

	//compila e publica localmente
	publish(fullVersion, () => {
		
		//apaga web.config, transfere para o public e apaga a local
		delivery(version, fullVersion, () => { alert("Tranferência finalizada!"); });
		
		console.log("Finalizado total! \nVersão: " + version);
		
	});
});



function getFullVersion (versionBase){
	if(versionBase != "MAIN")
		versionBase += ".1";

	return versionBase;
}