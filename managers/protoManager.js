const protobufjs = require('protobufjs')
const cfg = require('../config.json')

protobufjs.loadFromString = (name, protoStr) => {
    const fetchFunc = protobufjs.Root.prototype.fetch;
    protobufjs.Root.prototype.fetch = (_, cb) => cb(null, protoStr);
    const root = new protobufjs.Root().load(name);
    protobufjs.Root.prototype.fetch = fetchFunc;
    return root;
};

module.exports = {
    /**
     * Constructs protobuf message.
     *
     * @param {string} path Path to base protobuf directory.
     * @param {string} proto Protobuf file name (with extension) itself.
     * @param {boolean} encode If true will encode protobuf constructed message from JSON object.
     * @param {Object} data JSON object to be constructed into protobuf message.
     */
   async parseProto(path = `${cfg.data.proto}/${cfg.protocol.version}`, proto = "", encode = true, data = {}) {
        return new Promise((res, rej) => {
           protobufjs.load(`${path}/${proto}`).then(root => {
               let lookup = root.lookupType(`${proto.replaceAll(".proto", "")}`)

               const verifier = lookup.verify(data)
               if (verifier) return rej(verifier);

               let encoded = lookup.create(data)
               if (encode) {
                   res(lookup.encode(encoded).finish());
               } else {
                   res(encoded);

               }
           })

        })

    }
}