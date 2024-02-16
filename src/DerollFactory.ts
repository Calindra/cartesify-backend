import * as net from 'net';
import { CartesifyOptions } from './CartesifyBackend';
import { createApp } from '@deroll/app';


const NONODO_HTTP_SERVER_URL = new URL('http://127.0.0.1:8080/rollup')
const DEFAULT_ROLLUP_HTTP_SERVER_URL = new URL('http://127.0.0.1:5004')

export async function createDapp(options?: CartesifyOptions) {
    if (options?.url) {
        return createApp({ url: options?.url, broadcastAdvanceRequests: options?.broadcastAdvanceRequests });
    }
    const ROLLUP_HTTP_SERVER_URL = process.env.ROLLUP_HTTP_SERVER_URL || ""
    if (ROLLUP_HTTP_SERVER_URL) {
        return createApp({ url: ROLLUP_HTTP_SERVER_URL, broadcastAdvanceRequests: options?.broadcastAdvanceRequests });
    }
    // try to detect
    if (await isPortOpen(+NONODO_HTTP_SERVER_URL.port)) {
        return createApp({ url: NONODO_HTTP_SERVER_URL.toString(), broadcastAdvanceRequests: options?.broadcastAdvanceRequests });
    }
    if (await isPortOpen(+DEFAULT_ROLLUP_HTTP_SERVER_URL.port)) {
        return createApp({ url: DEFAULT_ROLLUP_HTTP_SERVER_URL.toString(), broadcastAdvanceRequests: options?.broadcastAdvanceRequests });
    }
    throw new Error('Unable to detect the Rollup Http Server')
}

function isPortOpen(port: number): Promise<boolean> {
    const server = net.createServer();

    return new Promise((resolve, reject) => {
        server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                // Port is in use
                resolve(true);
            } else {
                // Other error occurred
                reject(err);
            }
        });

        server.once('listening', () => {
            // Port is available
            server.close();
            resolve(false);
        });

        server.listen(port, '127.0.0.1');
    });
}
