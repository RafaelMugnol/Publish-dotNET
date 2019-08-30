const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())

// conta: MongoDB Atlas
// email: emailmercanetweb@gmail.com
// senha: "merc" + <senha padrão Mercanet Web>
//mongoose.connect('mongodb://admin:admin123@ds143326.mlab.com:43326/publish-dotnet', {
mongoose.connect('mongodb+srv://publicacao:publicacao123@cluster0-sfyki.gcp.mongodb.net/publish-dotnet?retryWrites=true&w=majority', {
    useNewUrlParser: true,
})

// middleware/interceptador
app.use((req, res, next) => {
    req.io = io;

    return next();
})

app.use(express.json())

app.use(require('./routes'))

server.listen(3333, () => {
    console.log('Servidor iniciado na porta 3333.')
})