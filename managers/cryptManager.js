const {readFileSync, readdirSync} = require("fs");
const keys = require("../data/configs/keys.json");
const crypto = require("crypto");
module.exports = {
    xorData(data, key) {
        for (let i = 0; i < data.length; i++) {
            data[i] ^= key[i % key.length];
        }
    },

    cloneBuffer(buffer) {
        const other = Buffer.allocUnsafe(buffer.length);
        buffer.copy(other);
        return other;
    },

    /**
     * ec2b provided buffer with provided key.
     *
     * @param {Buffer} buffer Buffer to ec2b.
     * @param {Buffer} key Key to use.
     * @return {Buffer} ec2b'ed buffer.
     */
    ec2b(buffer, key) {
        buffer = this.cloneBuffer(buffer);
        this.xorData(buffer, key);
        return buffer;
    },

    /**
     * Chunk current region and encrypt chunks.
     *
     * @param {Buffer} query Protobuf encoded query.
     * @param {Number} chunkSize Chunking size.
     * @param {Number} key_id Id of the key to use for encrypting.
     * @return {Promise} Stringified JSON object.
     */
    chunkCurrentRegion(query, chunkSize = 256 - 11, key_id = 0) {
        const regionkeys = new Map()
        return new Promise((res) => {
           const files = readdirSync(`${keys.regionKeysPath}`)
            files.forEach(file => {
                    const keyb = readFileSync(`${keys.regionKeysPath}/${file}`)
                    regionkeys.set(file.split(".")[0], keyb)
                })

            let signingkey = readFileSync(`${keys.signingKey}`)
            //backwards compatibility when tm
            //const curOSEncryptKey = readFileSync(`${gamekeys.get(key_id)}`)
            const curOSEncryptPub = crypto.createPublicKey({key: regionkeys.get(key_id), format: 'pem'}).export({format: 'pem', type: 'spki'})
            const signed = crypto.sign("SHA256", query ,{key: signingkey, passphrase: '', padding: crypto.constants.RSA_PKCS1_PADDING})

            let chunks = []

            for (let i = 0; i < query.length; i += chunkSize) {
                const chunk = query.slice(i, i + chunkSize);
                const encrypted = crypto.publicEncrypt({
                    key: curOSEncryptPub,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                }, chunk)
                chunks.push(encrypted)
            }

            let query_encrypted_buf = Buffer.concat(chunks)
            let query_enc_str = query_encrypted_buf.toString('base64')

            res(JSON.stringify({content: query_enc_str, sign: signed.toString("base64")}))
        })
    }
}