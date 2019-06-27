const alert = require("./helpers/alert");
const get = require("./actions/get");
const publish = require("./actions/publish");
const delivery = require("./actions/delivery");

class publishProcess {
	async inicia(version){
		//inicia
		console.log("Iniciando...");
		alert("Tranferência iniciada.");

		//get no tfs
		await convertToAsync(get, version);
		
		console.log("compila e publica localmente");
		//compila e publica localmente

		await convertToAsync(publish, version);

		console.log("fim compilacao");	
		//apaga web.config, transfere para o public e apaga a local
		//delivery(version, version, () => { alert("Tranferência finalizada!"); });
		await delivery(version);
		
		console.log("Finalizado total! \nVersão: " + version);
	}

	async iniciaFake(version){
		return true;
	}
}
module.exports = new publishProcess();

//https://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises
function convertToAsync(func, ...params){
	return new Promise((resolve, reject) => {
        func(...params, () => {
			resolve();
        }, reject);
    });
}