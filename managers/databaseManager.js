const mongoose = require('mongoose')
const crypto = require('crypto')
const {sendLog} = require("../utils/logUtils")
const models = require('../utils/models')
const cfg = require('../config.json')

const accmodel = new mongoose.model('accountModel', models.accountSchema(), 'account')
const rolemodel = new mongoose.model('roleModel', models.roleSchema(), 'roles')

module.exports = {
    connect(url = process.env.DB_URL) {
        mongoose.connect(`${url}`)
        const conn = mongoose.connection

        conn.on("connected", () => {
            sendLog("Database").info(`Database connection established!`)
            this.populateDatabaseDefaults().then(() => {})
        });

        conn.on("error", (err) => {
            sendLog("Database").error(err)
        });

        return conn;
    },

    populateDatabaseDefaults() {
        return new Promise(async (res, rej) => {
            rolemodel.countDocuments({name: 'admin'}, function (err, count) {
                if (err) return rej(err)
                if (count === 0) {
                    new rolemodel({role_id: `${crypto.randomInt(1000, 99999999)}`, name: `admin`, prefix: `&6[&cAdmin&6]&r `, created_by: `69`, permissions: [`*`]}).save(function (err, doc) {
                        if (err) return rej(err)
                        sendLog('database').debug(`Creating default role "admin"...`)
                    })
                    new rolemodel({role_id: `${crypto.randomInt(1000, 99999999)}`, name: `default`, prefix: ``, created_by: `69`, permissions: []}).save(function (err, doc) {
                        if (err) return rej(err)
                        sendLog('database').debug(`Creating default role "default"...`)
                    })
                    sendLog("Database").info(`Populated default database entries successfully.`)
                }
            });
        })
    }
}