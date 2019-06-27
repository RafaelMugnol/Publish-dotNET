const deleteDirR = require('../helpers/delete-dir-r.js');
const fs = require('fs-extra');
const clipboardy = require('clipboardy');
const config = require('../config.json');

function delivery(versao, fullVersion, cbAvailable){
	var caminhoLocal = config.LocalPath + versao;
	var caminhoPublic = config.PublicPath + versao;

	if(!fs.existsSync(caminhoLocal)){
		console.log("A publicação local não existe!")
		return;
	}

	console.log("Tranferindo a versão '" + versao + "'.");

	if(fs.existsSync(caminhoLocal + "/web.config")){
		console.log("Deletando web.config.");
		fs.unlinkSync(caminhoLocal + "/web.config");
	}

	//foi nessesario fazer isso pois não copiou alguns arquivos da bin (arrumar essa gambi futuramente!)
	//obs: essas dlls não estão nem na bin do projeto, estão somente nos componentes
	// const filesCopyBin = [
	// 	"System.Web.Helpers.dll",
	// 	"System.Web.Razor.dll",
	// 	"System.Web.WebPages.Deployment.dll",
	// 	"System.Web.WebPages.dll",
	// 	"System.Web.WebPages.Razor.dll"
	// ];
	// filesCopyBin.forEach(file => {
	// 	fs.copyFileSync(config.ProjectsPath + fullVersion + "/componentes/" + file, caminhoLocal + "/bin/" + file);
	// });
	//fim da gambi

	var caminhoPublicOld = caminhoPublic + "_old"

	if(fs.existsSync(caminhoPublic)){
		console.log("Renomeando pata public.");
		fs.renameSync(caminhoPublic, caminhoPublicOld);
	}

	console.log("Tranferindo arquivos.");
	fs.copySync(caminhoLocal, caminhoPublic);

	
	clipboardy.writeSync(replaceAll(caminhoPublic, "/", "\\"));
	if(cbAvailable)
		cbAvailable();//aqui avisar que esta disponivel a publicação

	console.log("Deletando arquivos local.");
	deleteDirR(caminhoLocal);

	if(fs.existsSync(caminhoPublicOld)){
		console.log("Deletando publicação old pasta public.");
		deleteDirR(caminhoPublicOld);
	}

}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

module.exports = delivery;