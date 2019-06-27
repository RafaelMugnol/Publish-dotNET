var _msbuild = require('msbuild');
const config = require('../config.json');

function publish(version, cb){
    var msbuild = new _msbuild(() =>{
        cb();
    }); 

    msbuild.setConfig({version: "4.0"});
    
    msbuild.sourcePath = config.ProjectsPath + version + '/Projetos/Mercanet/WebFormsUI/WebFormsUI.csproj';
    msbuild.publishProfile = config.PublishProfile;
    msbuild.overrideParams.push('/p:VisualStudioVersion=14.0');
    
    msbuild.publish();
}

module.exports = publish;