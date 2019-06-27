//import tfs from 'tfs';//modulo formato es6
const tfs = require('tfs');
const config = require('../config.json');

function get(version, cb){
  	var callback = function(responseError, response) {
    	if (responseError) {
    	  	console.error(responseError.error);
      		return;
    	}
		console.log(response.message);
		cb();
  	}

	var retorno = tfs("get", [config.ProjectsPath + version + "/Projetos/Mercanet"], {
		recursive: true
	}, callback);

	//console.log(retorno);
}

module.exports = get;
//export default get;