const express = require('express')
const {readFileSync} = require('fs')
const cfg = require("../config.json")
const keys = require('../data/configs/keys.json')

const {sendLog} = require('../utils/logUtils')
const cm = require('../managers/cryptManager')
const {parseProto} = require("../managers/protoManager")

module.exports = (function() {
    let reg = express.Router()

// /query_region_list?version=OSRELWin2.6.0&lang=1&platform=3&binary=1&time=966&channel_id=1&sub_channel_id=0
    reg.get('/query_region_list', async (req, res) => {
        try {

            let url = (process.env.ENV === 'dev') ? `http://${cfg.serverAddress}:${cfg.serverPort}` : `https://${cfg.serverAddress}:${cfg.serverPort}`
            let regions = []

            cfg.servers.forEach(server => {
                parseProto(`${cfg.advanced.data.proto}`, `RegionSimpleInfo.proto`, false, {
                    name: `${server.id}`, title: `${server.displayName}`, type: "DEV_PUBLIC",
                    dispatchUrl: new URL(`query_cur_region/${server.id}`, url).href
                }).then((resp) => regions.push(resp))
            })

            let customconfig = cm.ec2b(Buffer.from(JSON.stringify({sdkenv: 2, checkdevice: false, loadPatch: false,
                showexception: (process.env.ENV === "dev"), regionConfig: "pm|fk|add", downloadMode: 0}), "utf8"), readFileSync(`${keys.dispatchKey}`))

            parseProto(`${cfg.advanced.data.proto}`, `QueryRegionListHttpRsp.proto`, true, {
                regionList: regions, clientSecretKey: readFileSync(`${keys.dispatchSeed}`),
                enableLoginPc: true, clientCustomConfigEncrypted: customconfig
            }).then((resp) => {
                res.send(Buffer.from(resp).toString("base64"))
                sendLog('dispatch').info(`Querying region list for client with ip ${req.ip}`)
            })
        } catch (e) {
            sendLog('dispatch').error(e)
        }
    })

// /query_cur_region?version=OSRELWin2.6.0&lang=1&platform=3&binary=1&time=102&channel_id=1&sub_channel_id=0&account_type=1&dispatchSeed=1e0e352db05bd0a8
    reg.get(`/query_cur_region/:region`, async function (req, res) {
        try {
            let regionname = req.params.region
            const version = req.query.version.toString().replaceAll(RegExp("[a-zA-Z]", 'g'), "")
            console.log(regionname, version, req.query.key_id)

            const url = (process.env.ENV === 'dev') ? `http://${cfg.serverAddress}:${cfg.serverPort}` : `https://${cfg.serverAddress}:${cfg.serverPort}`

            let customconfig = cm.ec2b(Buffer.from(JSON.stringify({coverSwitch: [8], perf_report_config_url: new URL("config/verify", url),
                perf_report_record_url: new URL("dataUpload", url)
            })), readFileSync(`${keys.dispatchKey}`))

            const region = cfg.servers.filter(server => server.id === regionname)
            const gameIP = region[0].gameAddress.split(":")[0]
            const gamePort = region[0].gameAddress.split(":")[1]

            let regionInfo = await parseProto(`${cfg.advanced.data.proto}`, `RegionInfo.proto`, false,{
                gateserverIp: `${gameIP}`, gateserverPort: parseInt(gamePort),
                secretKey: readFileSync(`${keys.dispatchSeed}`)
            })

            parseProto(`${cfg.advanced.data.proto}`, `QueryCurrRegionHttpRsp.proto`, true, {
                regionInfo, clientSecretKey: readFileSync(`${keys.dispatchSeed}`),
                regionCustomConfigEncrypted: customconfig
            }).then(async (resp) => {
                const selected = await cm.chunkCurrentRegion(resp, 256 - 11, req.query.key_id)
                res.send(selected)
                sendLog('dispatch').info(`Querying current region for client with ip ${req.ip}`)
            })

        } catch (e) {
            sendLog('dispatch').error(e)
        }
    })

    return reg;
})()