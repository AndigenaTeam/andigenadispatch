const mongoose = require('mongoose')
const crypto = require('crypto')
const {sendLog} = require("../utils/logUtils")
const models = require('../utils/models')

const rolemodel = new mongoose.model('roleModel', models.roleSchema(), 'roles')

module.exports = {
    /**
     * Initialize connection to MongoDB database.
     *
     * @param {string} url Database connection url.
     * @return {conn} MongoDB database connection.
     */
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

    /**
     * Populates database with default values.
     */
    populateDatabaseDefaults() {
        return new Promise(async (res, rej) => {
            rolemodel.countDocuments({name: 'admin'}).then(count => {
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
            }).catch(err => {
                return rej(err)
            })
        })
    }
}