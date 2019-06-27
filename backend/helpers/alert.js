const notifier = require('node-notifier');

function alert(msg){
    notifier.notify({
        'title': 'Transferência publicação',
        'subtitle': 'Transferência',
        'message': msg,
        'icon': 'images/transferB.png',
        //'contentImage': 'blog.png',
        //'sound': 'ding.mp3',
        //'wait': true
    });
}

module.exports = alert;