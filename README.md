# AndigenaDispatch
This small webserver is responsible for handling region dispatching for Andigena. Pretty simple huh.

## Prerequisites
1. MongoDB database server
2. Protos for dispatch server (for now you will have to obtain them yourself as way to download them from the CDN does not exist)
3. Proxy service such as [MITMProxy](https://anonfiles.com/x9p5V4daz6/mitmproxy_for_andigena_zip) / [Fiddler](https://pastebin.com)

## How to use in production
1. Clone/download this repository `git clone https://github.com/AndigenaTeam/andigenadispatch.git`
2. Copy `.env.example` and rename to `.env`
3. Start your server
4. Server will generate default configuration files and empty `/data/proto` directory
5. Place your dispatch protos in `/data/proto`
6. Make your configuration changes if needed
7. Start/restart your server
8. **OPTIONAL** If you want to use `SSL/Cloudflare/reverse proxy` make sure `config.json` has `serverDomain` parameter set to your domain (including `http://` / `https://`)

## Issues & Contributions
If you want to contribute you are feel free to make a pull request.
If you encounter any issues open an issue under `Issues` tab.

