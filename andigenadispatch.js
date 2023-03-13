require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser")
const http = express()
const {sendLog, archiveOldLogs} = require('./utils/logUtils')
const {createFoldersAndConfigs} = require('./utils/configUtils')
const db = require('./managers/databaseManager')

archiveOldLogs().then(() => {})
createFoldersAndConfigs()
const cfg = require('./config.json')

http.use(bodyParser.urlencoded({extended: true}))
http.use(bodyParser.json())

http.use('/', require('./routes/regionRoutes'))
http.use('/', require('./routes/miscRoutes'))

http.get('/', async function(req, res) {
    res.json({retcode: 200, message: "AndigenaDispatch online."})
})

const server = http.listen(cfg.serverPort, `${cfg.serverAddress}`, async () => {
    db.connect(process.env.DB_URL)
    sendLog("dispatch").info(`AndigenaDispatch listening on ${server.address().address}:${server.address().port}`)
})