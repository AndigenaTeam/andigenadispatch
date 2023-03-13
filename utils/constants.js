
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const ClientType = {
    Editor: 0,
    IOS: 1,
    Android: 2,
    PC: 3,
    PS4: 4,
    Server: 5,
    CloudAndroid: 6,
    CloudIOS: 7,
    PS5: 8,
    CloudWeb: 9,
    CloudTV: 10,
    CloudMAC: 11,
    CloudPC: 12,
    Cloud3rdPartyMobile: 13,
    Cloud3rdPartyPC: 14
}

const statusCodes = {
    error: {
        MAINTENANCE: 11,
        FAIL: -1
    },
    success: {
        WEB_STANDARD: 200,
        RETCODE: 0,
        REGISTER: 1,
        PAY_LAUNCH: -120
    }
}

const DEFAULT_CONFIG = {
    serverAddress: "127.0.0.1",
    serverPort: 663,
    serverDomain: "",
    servers: [
        {
            id: "os_andigena",
            displayName: "Andigena Test",
            gameAddress: "127.0.0.1:8999",
            maintenance: {
                enabled: false,
                startTime: 1678596956514,
                endTime: 1678597030228,
                url: "https://github.com/andigenateam",
                header: "Maintenance in progress...",
                message: "Server is under maintenance! Check back later..."
            },
            protocol: {
                forceVersion: false,
                url: "https://github.com/andigenateam",
                whitelistedVersions: ["3.5.0"]
            },
        }
    ],
    advanced: {
        data: {
            proto: "./data/proto"
        },
        keys: {
            region: "./data/keys/region_keys"
        }
    }
}

const DEFAULT_KEYS_CONFIG = {
    dispatchKey: "./data/keys/dispatchKey.bin",
    dispatchSeed: "./data/keys/dispatchSeed.bin",
    secretKey: "./data/keys/secretKey.bin",
    signingKey: "./data/keys/SigningKey.pem",
    auth: {
        public: "./data/keys/auth/auth_public_key.pem",
        private: "./data/keys/auth/auth_private_key.pem"
    }
}

module.exports = {DEFAULT_CONFIG, DEFAULT_KEYS_CONFIG, EMAIL_REGEX, ClientType, statusCodes}