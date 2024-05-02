import { describe, it, expect } from "@jest/globals";
import { FetchCommand } from "../src/FetchCommand";
import { App } from "@deroll/core";


describe("FetchCommand", () => {

    const app = {
        createReport: () => {
        }
    } as unknown as App

    it("should block port 8080", async () => {
        const fetchConfig = {
            url: 'http://127.0.0.1:8080'
        }
        const result = await FetchCommand.execute(fetchConfig, app)
        expect(result).toBe("reject")
    })

    it("should block port 5004", async () => {
        const fetchConfig = {
            url: 'http://127.0.0.1:5004'
        }
        const result = await FetchCommand.execute(fetchConfig, app)
        expect(result).toBe("reject")
    })
})
