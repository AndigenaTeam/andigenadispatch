const express = require('express')
const {readFileSync} = require('fs')
const cfg = require("../config.json")
const keys = require('../data/configs/keys.json')
const {sendLog} = require('../utils/logUtils')
const cm = require('../managers/cryptManager')
const {parseProto} = require("../managers/protoManager")
const {statusCodes} = require("../utils/constants");

module.exports = (function() {
    let reg = express.Router()

// /query_region_list?version=OSRELWin2.6.0&lang=1&platform=3&binary=1&time=966&channel_id=1&sub_channel_id=0
    reg.get('/query_region_list', async (req, res) => {
        try {
            let sdke;
            if (cfg.advanced.sdkenv.force) {
                sdke = cfg.advanced.sdkenv.env;
            } else {
                sdke = (req.query.version.includes("CN")) ? 0 : 2
            }
            let url = (cfg.serverDomain === "") ? `http://${cfg.serverAddress}:${cfg.serverPort}` : `${cfg.serverDomain}`
            let regions = []

            cfg.servers.forEach(server => {
                parseProto(`${cfg.advanced.data.proto}`, `RegionSimpleInfo.proto`, false, {
                    name: `${server.id}`, title: `${server.displayName}`, type: "DEV_PUBLIC",
                    dispatchUrl: new URL(`query_cur_region/${server.id}`, url).href
                }).then((resp) => regions.push(resp))
            })

            let customconfig = cm.ec2b(Buffer.from(JSON.stringify({sdkenv: sdke, checkdevice: false, loadPatch: false,
                showexception: (process.env.ENV === "dev"), regionConfig: "pm|fk|add", downloadMode: 0, }), "utf8"), readFileSync(`${keys.dispatchKey}`))

            parseProto(`${cfg.advanced.data.proto}`, `QueryRegionListHttpRsp.proto`, true, {
                regionList: regions, clientSecretKey: readFileSync(`${keys.dispatchSeed}`),
                enableLoginPc: true, clientCustomConfigEncrypted: customconfig
            }).then((resp) => {
                sendLog('/query_region_list').debug(`${Buffer.from(resp).toString("base64")}`)
                res.send(Buffer.from(resp).toString("base64"))
                sendLog('dispatch').info(`Querying region list for client with ip ${req.ip}`)
            })
        } catch (e) {
            res.send(Buffer.from('An error occurred!').toString('base64'))
            sendLog('dispatch').error(e)
        }
    })

// /query_cur_region?version=OSRELWin2.6.0&lang=1&platform=3&binary=1&time=102&channel_id=1&sub_channel_id=0&account_type=1&dispatchSeed=1e0e352db05bd0a8
    reg.get(`/query_cur_region/:region`, async function (req, res) {
        try {
            let regionname = req.params.region
            const version = (req.query.version) ? req.query.version.toString().replaceAll(RegExp("[a-zA-Z]", 'g'), "") : ""

            const url = (cfg.serverDomain === "") ? `http://${cfg.serverAddress}:${cfg.serverPort}` : `${cfg.serverDomain}`

            let customconfig = cm.ec2b(Buffer.from(JSON.stringify({coverSwitch: [8], perf_report_config_url: new URL("config/verify", url), perf_report_record_url: new URL("dataUpload", url)})), readFileSync(`${keys.dispatchKey}`))

            const region = cfg.servers.filter(server => server.id === regionname)
            const gameIP = region[0].gameAddress.split(":")[0]
            const gamePort = region[0].gameAddress.split(":")[1]

            let regionInfo = await parseProto(`${cfg.advanced.data.proto}`, `RegionInfo.proto`, false,{
                gateserverIp: `${gameIP}`, gateserverPort: parseInt(gamePort), useGateserverDomainname: region[0].useGameDomain, gateserverDomainname: region[0].gameDomain, secretKey: readFileSync(`${keys.dispatchSeed}`),
                officialCommunityUrl: region[0].urls.officialCommunity, userCenterUrl: region[0].urls.userCenter, accountBindUrl: region[0].urls.accountBind,
                cdKeyUrl: region[0].urls.cdKey, privacyPolicyUrl: region[0].urls.privacyPolicy, handbookUrl: region[0].urls.handbook, bulletinUrl: region[0].urls.bulletin,
                feedbackUrl: region[0].urls.feedback, payCallbackUrl: region[0].urls.payCallback
            })

            let curregionrspd = {regionInfo, clientSecretKey: readFileSync(`${keys.dispatchSeed}`), regionCustomConfigEncrypted: customconfig}
            let stopserver = {}

            if (region[0].maintenance.enabled) {
                if (region[0].maintenance.startTime !== "" && region[0].maintenance.endTime !== "") {
                    let header = (region[0].maintenance.header === "") ? `${region[0].displayName} maintenance in progress...` : region[0].maintenance.header
                    stopserver = {stopBeginTime: Math.floor(new Date(`${region[0].maintenance.startTime}`).getTime() / 1000), stopEndTime: Math.floor(new Date(`${region[0].maintenance.endTime}`).getTime() / 1000).valueOf(), url: region[0].maintenance.url, contentMsg: `${region[0].maintenance.message}`}
                    curregionrspd = {retcode: statusCodes.error.MAINTENANCE, msg: `${header}`, stopServer: stopserver, regionInfo: {}}
                }
            }

            if (region[0].protocol.forceVersion && !region[0].maintenance.enabled) {
                if (!region[0].protocol.whitelistedVersions.includes(version)) {
                    stopserver = {stopBeginTime: Math.floor(Date.now() / 1000), stopEndTime: Math.floor(Date.now() / 1000) * 2, url: region[0].protocol.url, contentMsg: `Your client version ${version} is not whitelisted on this server!\nPlease use one of: ${region[0].protocol.whitelistedVersions} to connect to ${region[0].displayName}.`}
                    curregionrspd = {retcode: statusCodes.error.MAINTENANCE, msg: "Client version whitelist error", stopServer: stopserver, regionInfo: {}}
                }
            }

            parseProto(`${cfg.advanced.data.proto}`, `QueryCurrRegionHttpRsp.proto`, true, curregionrspd).then(async (resp) => {
                const selected = (req.query.key_id) ? await cm.chunkCurrentRegion(resp, 256 - 11, req.query.key_id) : null
                sendLog(`/query_cur_region/${regionname}`).debug(`${selected}`)
                res.send(selected)
                sendLog('dispatch').info(`Querying current region for client with ip ${req.ip} (Region: ${regionname})`)
            })

        } catch (e) {
            res.send(JSON.stringify({content: Buffer.from("An error occurred!").toString('base64'), sign: Buffer.from("An error occurred!").toString('base64')}))
            sendLog('dispatch').error(e)
        }
    })

    return reg;
})()