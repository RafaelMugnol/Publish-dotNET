// var objA = { prop1: 1 };
// var objB = { prop2: 2, prop1: 2 };

// var objC = { ...objA, ...objB };
// var objD = { ...objB, ...objA };
// var objA = { ...objA, ...objB };


// console.log(objA);
// console.log(objC);
// console.log(objD);


// const tfs = require('tfs');

// console.log("iniciando");

// var callback = function(responseError, response) {
// 	if (responseError) {
// 		console.error(responseError.error);
// 		return;
// 	}

// 	console.log(response.message);
// }

// tfs('get', ["C:/Projetos/ExportacaoGrid"], {
// 	recursive: true
// }, callback);

// var _msbuild = require('msbuild');

// console.log("iniciando");

// var msbuild = new _msbuild(() =>{
   
// }); 

// msbuild.setConfig({version: "4.0"});

// msbuild.sourcePath = "C:/MercanetProjetos/MAIN/Projetos/Mercanet/WebFormsUI/WebFormsUI.csproj";
// msbuild.publishProfile = "publicacao";
// msbuild.overrideParams.push('/p:VisualStudioVersion=14.0');

// msbuild.publish();

const PublishProcess = require('./publishProcess');

executa = async () => {
    var sucess = await PublishProcess.inicia("MAIN");

    console.log(sucess);
}

executa();

