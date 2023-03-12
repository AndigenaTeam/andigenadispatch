
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
        FAIL: -1,
        CANCEL: -2,
        NO_SUCH_METHOD: -10,
        LOGIN_BASE: -100,
        LOGIN_FAILED: -101,
        LOGIN_CANCEL: -102,
        LOGIN_ERROR: -103,
        LOGOUT_FAILED: -104,
        LOGOUT_CANCEL: -105,
        LOGOUT_ERROR: 106,
        PAY_FAILED: -107,
        PAY_CANCEL: -108,
        PAY_ERROR: -109,
        PAY_UNKNOWN: -116,
        EXIT_FAILED: -110,
        EXIT_NO_DIALOG: -111,
        EXIT_CANCEL: -112,
        EXIT_ERROR: -113,
        INIT_FAILED: -114,
        INIT_ERROR: -115,
        LOGIN_FORBIDDED: -117,
        NEED_REALNAME: -118,
        NEED_GUARDIAN: -119,
        EOS_DLL_ERROR: -1001,
        EOS_TOKEN_ERROR: -1002,
        GOOGLE_PC_TOKEN_ERROR: -1003
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
                serverVersion: "350",
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