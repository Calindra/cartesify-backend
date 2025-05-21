import { TypedDataDomain, ethers } from "ethers";

export interface TypedData {
    domain: TypedDataDomain;
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: any;
}

/**
 * Utility class for EIP-712 signature verification
 */
export class VerifyEIP712 {
    /**
     * Verify an EIP-712 signature
     * 
     * @param typedData The EIP-712 typed data that was signed
     * @param signature The signature to verify
     * @returns The address of the signer
     */
    static async verifySigner(typedData: TypedData, signature: string): Promise<string> {
        try {
            // Verify the signature
            const { domain, types, message } = typedData;
            
            // Extract EIP-712 types while removing EIP712 specific keys
            const domainType = Object.keys(types).find(type => type !== 'EIP712Domain') || '';
            const { primaryType } = typedData;
            
            // Recover the address from the signature
            const address = ethers.verifyTypedData(
                domain,
                { [primaryType]: types[primaryType] },
                message,
                signature
            );
            
            return address;
        } catch (error) {
            console.error("Error verifying EIP-712 signature:", error);
            throw new Error("Invalid EIP-712 signature");
        }
    }

    /**
     * Parse a base64 encoded typed data string into a TypedData object
     * 
     * @param typedDataBase64 Base64 encoded string of typed data
     * @returns Parsed TypedData object
     */
    static parseTypedData(typedDataBase64: string): TypedData {
        try {
            const jsonStr = atob(typedDataBase64);
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Error parsing typed data:", error);
            throw new Error("Invalid typed data format");
        }
    }
}