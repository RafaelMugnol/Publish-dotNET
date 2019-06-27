const express = require('express')
const routes = express.Router()
const PublishController = require('./controllers/publish')

routes.post('/publish', PublishController.start)
routes.get('/packs', PublishController.list)
routes.post('/addpack', PublishController.add)

module.exports = routes