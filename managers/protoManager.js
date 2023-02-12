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

   async parseProto(path = `${cfg.data.proto}/${cfg.protocol.version}`, proto = "", encode = true, data = {}) {
        return new Promise((res, rej) => {
            // reimplement if protos rly grow big

            /*let parsed = new Map()
            tar.list({
                    sync: true,
                    file: `${path}`,
                    filter: path => path === `${proto}`,
                    onentry: entry => entry.on('data', d => {parsed.set(entry.path, d)})
                })

            let selected = Array.from(parsed.keys()).filter(f => f === proto)
            let buffer = parsed.get(selected[0])

            console.log(Buffer.from(buffer).toString("utf-8"))

            writeFileSync(`./data/proto/tmp/${selected[0]}`, buffer, {encoding: "utf-8"})

            setTimeout(() => {
                readdirSync('./data/proto/tmp/').forEach(f => {
                    unlinkSync(`./data/proto/tmp/${f}`)
                })
            }, 10000)*/

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