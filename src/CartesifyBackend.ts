import { writeFile } from "fs/promises";
import { AxiosCommand } from "./AxiosCommand";
import { Hex } from "viem";
import { FetchCommand } from "./FetchCommand";
import { createDapp } from "./DerollFactory";

const DEV_MODE = process.env.DEV_MODE === "true"

export interface CartesifyOptions {
    url: string;
    broadcastAdvanceRequests?: boolean;
}

export default class CartesifyBackend {

    static async createDapp(options?: CartesifyOptions) {
        // create application
        const app = await createDapp(options);

        // handle input encoded as hex
        app.addAdvanceHandler(async ({ payload, metadata }) => {
            try {
                const hexString = payload.replace(/^0x/, '');
                const buffer = Buffer.from(hexString, "hex");

                // Convert the buffer to a utf8 string
                const utf8String = buffer.toString("utf8");
                // console.log('inside the dApp', hexString);
                // console.log('inside the dApp', utf8String);
                const json = JSON.parse(utf8String)
                if (json.cartesify) {
                    if (json.cartesify.delay) {
                        console.time(`Delay ${json.cartesify.delay}s`)
                        await new Promise((resolve) => setTimeout(resolve, json.cartesify.delay * 1000))
                        console.timeEnd(`Delay ${json.cartesify.delay}s`)
                        return "accept"
                    }
                    if (DEV_MODE && json.cartesify.file) {
                        await writeFile(json.cartesify.file, json.cartesify.content)
                        console.log(`File ${json.cartesify.file}`)
                        console.log(`Sending accept`)
                        return "accept"
                    }
                    if (json.cartesify.axios) {
                        return await AxiosCommand.execute(json.cartesify.axios, app, metadata)
                    }
                    if (json.cartesify.fetch) {
                        return await FetchCommand.execute(json.cartesify.fetch, app, metadata)
                    }
                }
                return "reject"
            } catch (e) {
                console.error(e);
                console.log(`Sending reject`)
                if (e instanceof Error) {
                    const jsonString = JSON.stringify({ error: { message: e.message } })
                    const buffer = Buffer.from(jsonString, "utf8")
                    const hexPayload: Hex = `0x${buffer.toString("hex")}`
                    await app.createReport({ payload: hexPayload })
                } else {
                    const jsonString = JSON.stringify({ error: { message: 'Unexpected error' } })
                    const buffer = Buffer.from(jsonString, "utf8")
                    const hexPayload: Hex = `0x${buffer.toString("hex")}`
                    await app.createReport({ payload: hexPayload })
                }
                return "reject"
            }
        });

        app.addInspectHandler(async ({ payload }) => {
            try {
                const hexString = payload.replace(/^0x/, '');
                const buffer = Buffer.from(hexString, "hex");

                // Convert the buffer to a utf8 string
                const utf8String = buffer.toString("utf8");
                const json = JSON.parse(utf8String)
                if (json.cartesify?.axios) {
                    await AxiosCommand.execute(json.cartesify.axios, app)
                }
                if (json.cartesify.fetch) {
                    await FetchCommand.execute(json.cartesify.fetch, app)
                }
            } catch (e) {
                console.error(e);
            }
        })
        return app
    }
}

export { CartesifyBackend }