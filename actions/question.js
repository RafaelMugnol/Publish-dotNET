const readline = require('readline-sync');

function question (){
    let versao = readline.question('Versao desejada: ');
    
    if(versao == '')
		versao = 'MAIN';

    return versao;
}

module.exports = question;