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
  
	tfs('get', [config.ProjectsPath + version], {
		recursive: true
	}, callback);
}

module.exports = get;
//export default get;