const express = require('express')

module.exports = (function() {
    let miscr = express.Router()

    miscr.all(`/common/h5log/log/batch`, function (req, res) {
        return res.json({"retcode":0,"message":"OK","data":{}})
    })

    // abtest-api-data-sg.hoyoverse.com
    miscr.all(`/data_abtest_api/config/experiment/list`, function (req, res) {
        return res.json({"retcode":0,"success":true,"message":"","data":[{"code":1000,"type":2,"config_id":"14","period_id":"6036_99","version":"1","configs":{"cardType":"old"}}]})
    })

    // log-upload-os.mihoyo.com
    miscr.all(`/log/sdk/upload`, function (req, res) {
        //console.log('/log/sdk/upload', req.body)
        return res.json({code: 0})
    })

    miscr.all(`/sdk/upload`, function (req, res) {
        //console.log('/sdk/upload', req.body)
        return res.json({code: 0})
    })

    miscr.post(`/sdk/dataUpload`, function (req, res) {
        //console.log('/sdk/dataupload', req.body[0].uploadContent)
        return res.json({code: 0})
    })

    miscr.post(`/crash/dataUpload`, function (req, res) {
        //console.log(`crash/dataupload`, req.body)
        return res.json({code: 0})
    })

    miscr.post(`/log`, function (req, res) {
        //console.log(`/log`, req.body)
        return res.json({code: 0})
    })

    // /client/event/dataUpload
    miscr.post(`/client/event/dataUpload`, function (req, res) {
        //console.log(`/client/event/dataUpload`, req.body)
        return res.json({code: 0})
    })

    // /perf/config/verify?device_id=xxx&platform=x&name=xxx
    miscr.all(`/perf/config/verify`, function (req, res) {
        return res.json({code: 0})
    })

    miscr.all(`/device-fp/api/getExtList`, function (req, res) {
        return res.send({"retcode":0,"message":"OK","data":{"code":200,"msg":"ok","ext_list":["cpuName","systemName","systemType","deviceUID","gpuID","gpuName","gpuAPI","gpuVendor","gpuVersion","gpuMemory","osVersion","cpuCores","cpuFrequency","gpuVendorID","isGpuMultiTread","memorySize"],"pkg_list":[]}})
    })

    miscr.all(`/device-fp/api/getFp`, function (req, res) {
        return res.send({"retcode":0,"message":"OK","data":{"device_fp":`${req.body.device_fp}`,"code":200,"msg":"ok"}})
    })

    return miscr;
})()