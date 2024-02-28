var $62Lzo$buffer = require("buffer");
var $62Lzo$fspromises = require("fs/promises");
var $62Lzo$axios = require("axios");
var $62Lzo$net = require("net");
var $62Lzo$derollapp = require("@deroll/app");


function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $882b6d93070905b3$export$2e2bcd8739ae039);
$parcel$export(module.exports, "CartesifyBackend", () => $5d9a6ff6946abf10$export$2e2bcd8739ae039);



var $8bfb0420afdbb884$require$Buffer = $62Lzo$buffer.Buffer;
class $8bfb0420afdbb884$export$47d6791349428df {
    static async execute(axiosConfig, app, metadata) {
        try {
            const resp = await (0, ($parcel$interopDefault($62Lzo$axios)))(axiosConfig);
            const jsonString = JSON.stringify({
                success: {
                    data: resp.data,
                    headers: resp.headers,
                    status: resp.status
                }
            });
            const buffer = $8bfb0420afdbb884$require$Buffer.from(jsonString, "utf8");
            const hexPayload = `0x${buffer.toString("hex")}`;
            await app.createReport({
                payload: hexPayload
            });
            return "accept";
        } catch (e) {
            if ((0, ($parcel$interopDefault($62Lzo$axios))).isAxiosError(e)) {
                const jsonString = JSON.stringify({
                    error: {
                        ...e.toJSON()
                    }
                });
                console.log(e.toJSON());
                const buffer = $8bfb0420afdbb884$require$Buffer.from(jsonString, "utf8");
                const hexPayload = `0x${buffer.toString("hex")}`;
                await app.createReport({
                    payload: hexPayload
                });
                return "reject";
            } else throw e;
        }
    }
}



var $07c7c64db83da72f$require$Buffer = $62Lzo$buffer.Buffer;
class $07c7c64db83da72f$export$8a96e994038b4039 {
    static async execute(fetchConfig, app, metadata = {}) {
        try {
            const headers = fetchConfig.options?.headers || {};
            Object.getOwnPropertyNames(metadata).forEach((property)=>{
                headers[`x-${property}`] = `${metadata[property] ?? ""}`;
            });
            const resp = await fetch(fetchConfig.url, {
                ...fetchConfig.options,
                headers: headers
            });
            const jsonString = JSON.stringify({
                command: "cartesify:fetch",
                success: {
                    text: await resp.text(),
                    headers: Array.from(resp.headers.entries()),
                    status: resp.status,
                    ok: resp.ok,
                    type: resp.type
                }
            });
            const buffer = $07c7c64db83da72f$require$Buffer.from(jsonString, "utf8");
            const hexPayload = `0x${buffer.toString("hex")}`;
            await app.createReport({
                payload: hexPayload
            });
            if (resp.status >= 200 && resp.status < 300) return "accept";
            else return "reject";
        } catch (e) {
            if (e instanceof TypeError) {
                const jsonString = JSON.stringify({
                    command: "cartesify:fetch",
                    error: {
                        constructorName: "TypeError",
                        message: e.message,
                        cause: e.cause
                    }
                });
                const buffer = $07c7c64db83da72f$require$Buffer.from(jsonString, "utf8");
                const hexPayload = `0x${buffer.toString("hex")}`;
                await app.createReport({
                    payload: hexPayload
                });
                return "reject";
            }
            console.error(`Unexpected error executing fetch on url="${fetchConfig.url}"`);
            throw e;
        }
    }
}




const $025d58e666da47ef$var$NONODO_HTTP_SERVER_URL = new URL("http://127.0.0.1:8080/rollup");
const $025d58e666da47ef$var$DEFAULT_ROLLUP_HTTP_SERVER_URL = new URL("http://127.0.0.1:5004");
async function $025d58e666da47ef$export$6acda3d18e26bb60(options) {
    if (options?.url) return (0, $62Lzo$derollapp.createApp)({
        url: options?.url,
        broadcastAdvanceRequests: options?.broadcastAdvanceRequests
    });
    const ROLLUP_HTTP_SERVER_URL = "";
    if (ROLLUP_HTTP_SERVER_URL) return (0, $62Lzo$derollapp.createApp)({
        url: ROLLUP_HTTP_SERVER_URL,
        broadcastAdvanceRequests: options?.broadcastAdvanceRequests
    });
    // try to detect
    if (await $025d58e666da47ef$var$isPortOpen(+$025d58e666da47ef$var$NONODO_HTTP_SERVER_URL.port)) return (0, $62Lzo$derollapp.createApp)({
        url: $025d58e666da47ef$var$NONODO_HTTP_SERVER_URL.toString(),
        broadcastAdvanceRequests: options?.broadcastAdvanceRequests
    });
    if (await $025d58e666da47ef$var$isPortOpen(+$025d58e666da47ef$var$DEFAULT_ROLLUP_HTTP_SERVER_URL.port)) return (0, $62Lzo$derollapp.createApp)({
        url: $025d58e666da47ef$var$DEFAULT_ROLLUP_HTTP_SERVER_URL.toString(),
        broadcastAdvanceRequests: options?.broadcastAdvanceRequests
    });
    throw new Error("Unable to detect the Rollup Http Server");
}
function $025d58e666da47ef$var$isPortOpen(port) {
    const server = $62Lzo$net.createServer();
    return new Promise((resolve, reject)=>{
        server.once("error", (err)=>{
            if (err.code === "EADDRINUSE") // Port is in use
            resolve(true);
            else // Other error occurred
            reject(err);
        });
        server.once("listening", ()=>{
            // Port is available
            server.close();
            resolve(false);
        });
        server.listen(port, "127.0.0.1");
    });
}



var $5d9a6ff6946abf10$require$Buffer = $62Lzo$buffer.Buffer;
const $5d9a6ff6946abf10$var$DEV_MODE = false;
class $5d9a6ff6946abf10$export$2e2bcd8739ae039 {
    static async createDapp(options) {
        // create application
        const app = await (0, $025d58e666da47ef$export$6acda3d18e26bb60)(options);
        // handle input encoded as hex
        app.addAdvanceHandler(async ({ payload: payload, metadata: metadata })=>{
            try {
                if (!/^0x7b22/.test(payload)) return "reject";
                const hexString = payload.replace(/^0x/, "");
                const buffer = $5d9a6ff6946abf10$require$Buffer.from(hexString, "hex");
                // Convert the buffer to a utf8 string
                const utf8String = buffer.toString("utf8");
                // console.log('inside the dApp', hexString);
                // console.log('inside the dApp', utf8String);
                const json = JSON.parse(utf8String);
                if (json.cartesify) {
                    if (json.cartesify.delay) {
                        console.time(`Delay ${json.cartesify.delay}s`);
                        await new Promise((resolve)=>setTimeout(resolve, json.cartesify.delay * 1000));
                        console.timeEnd(`Delay ${json.cartesify.delay}s`);
                        return "accept";
                    }
                    if ($5d9a6ff6946abf10$var$DEV_MODE && json.cartesify.file) {
                        await (0, $62Lzo$fspromises.writeFile)(json.cartesify.file, json.cartesify.content);
                        console.log(`File ${json.cartesify.file}`);
                        console.log(`Sending accept`);
                        return "accept";
                    }
                    if (json.cartesify.axios) return await (0, $8bfb0420afdbb884$export$47d6791349428df).execute(json.cartesify.axios, app, metadata);
                    if (json.cartesify.fetch) return await (0, $07c7c64db83da72f$export$8a96e994038b4039).execute(json.cartesify.fetch, app, metadata);
                }
                return "reject";
            } catch (e) {
                console.error(e);
                console.log(`Sending reject`);
                if (e instanceof Error) {
                    const jsonString = JSON.stringify({
                        error: {
                            message: e.message
                        }
                    });
                    const buffer = $5d9a6ff6946abf10$require$Buffer.from(jsonString, "utf8");
                    const hexPayload = `0x${buffer.toString("hex")}`;
                    await app.createReport({
                        payload: hexPayload
                    });
                } else {
                    const jsonString = JSON.stringify({
                        error: {
                            message: "Unexpected error"
                        }
                    });
                    const buffer = $5d9a6ff6946abf10$require$Buffer.from(jsonString, "utf8");
                    const hexPayload = `0x${buffer.toString("hex")}`;
                    await app.createReport({
                        payload: hexPayload
                    });
                }
                return "reject";
            }
        });
        app.addInspectHandler(async ({ payload: payload })=>{
            try {
                const hexString = payload.replace(/^0x/, "");
                const buffer = $5d9a6ff6946abf10$require$Buffer.from(hexString, "hex");
                // Convert the buffer to a utf8 string
                const utf8String = buffer.toString("utf8");
                const json = JSON.parse(utf8String);
                if (json.cartesify?.axios) await (0, $8bfb0420afdbb884$export$47d6791349428df).execute(json.cartesify.axios, app);
                if (json.cartesify.fetch) await (0, $07c7c64db83da72f$export$8a96e994038b4039).execute(json.cartesify.fetch, app);
            } catch (e) {
                console.error(e);
            }
        });
        return app;
    }
}


var $882b6d93070905b3$export$2e2bcd8739ae039 = (0, $5d9a6ff6946abf10$export$2e2bcd8739ae039);


//# sourceMappingURL=index.js.map
