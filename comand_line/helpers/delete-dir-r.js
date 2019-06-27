/**
 * https://gist.github.com/cirocosta/f0e7f16718d739a13dee
 * 
 * Recursively removes files/dir from a path. If an error happens, it
 * returns it with the callback.
 */
var deleteDirR = function(path) {
    var fs = require('fs');
    var files = [];
    var curPath = '';

    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);

        files.forEach(function(file,index){
            curPath = path + '/' + file;

            console.log(curPath);

            if (fs.lstatSync(curPath).isDirectory())
                deleteDirR(curPath);
            else
                fs.unlinkSync(curPath);
        });

        fs.rmdirSync(path);
    } else {
        throw new Error('The path passed does not exist.');
    }
};

module.exports = deleteDirR;