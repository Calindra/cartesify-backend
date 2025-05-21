# EIP-712 Verification Support in Cartesify Backend

This document describes the EIP-712 verification functionality added to the Cartesify Backend library. This implementation enables backend services to verify EIP-712 signatures sent from the Cartesify frontend.

## Overview

The Cartesify Backend now includes utilities for verifying EIP-712 signatures. These utilities allow your Express.js application to:

1. Parse EIP-712 typed data
2. Verify signatures against typed data
3. Confirm the identity of message signers

## Usage

### Basic Verification Example

```javascript
const express = require('express');
const { CartesifyBackend, VerifyEIP712 } = require('@calindra/cartesify-backend');

// Create Express application
const app = express();
app.use(express.json());

// Start Cartesify backend
CartesifyBackend.createDapp().then(dapp => {
    dapp.start().catch(console.error);
});

// Protected route that requires EIP-712 signature
app.post("/secured-endpoint", async (req, res) => {
    try {
        // Access the sender address (added by Cartesify)
        const senderAddress = req.header("x-msg_sender");
        
        // Access the EIP-712 signature and typed data
        const { signature, typedData: typedDataBase64 } = req.body;
        
        if (!signature || !typedDataBase64) {
            return res.status(400).json({ error: "Missing signature or typed data" });
        }
        
        // Parse the base64 encoded typed data
        const typedData = VerifyEIP712.parseTypedData(typedDataBase64);
        
        // Verify that the signature matches the typed data and get the signer
        const recoveredAddress = await VerifyEIP712.verifySigner(typedData, signature);
        
        // Check if the recovered address matches the sender address
        if (recoveredAddress.toLowerCase() !== senderAddress.toLowerCase()) {
            return res.status(401).json({ error: "Invalid signature" });
        }
        
        // Signature is valid, proceed with the secured action
        res.json({
            success: true,
            message: "Authentication successful",
            sender: senderAddress
        });
    } catch (error) {
        console.error("Error in signature verification:", error);
        res.status(500).json({ error: "Failed to verify signature" });
    }
});

app.listen(8383, () => {
    console.log("Server running on port 8383");
});
```

## API Reference

### VerifyEIP712.verifySigner(typedData, signature)

Verifies an EIP-712 signature and returns the signer's address.

- **Parameters**:
  - `typedData` (Object): The EIP-712 typed data object that was signed
  - `signature` (String): The signature to verify
- **Returns**: Promise<string> - The address of the signer
- **Throws**: Error if the signature is invalid

### VerifyEIP712.parseTypedData(typedDataBase64)

Parses a base64 encoded typed data string into a TypedData object.

- **Parameters**:
  - `typedDataBase64` (String): Base64 encoded string of typed data
- **Returns**: TypedData object
- **Throws**: Error if the format is invalid

## Security Considerations

When implementing EIP-712 verification, consider the following security best practices:

1. **Always verify the signer**: Ensure the recovered address matches the expected signer
2. **Check the domain**: Verify that the domain in the typed data matches your application
3. **Validate the message content**: Check that the message contains the expected fields and values
4. **Prevent replay attacks**: Use the nonce field to prevent message reuse
5. **Use HTTPS**: Always use HTTPS to protect data in transit

For more details on EIP-712 security, refer to the [EIP-712 specification](https://eips.ethereum.org/EIPS/eip-712).

## Example Implementation

See the full example implementation in the `examples/eip712-verification.js` file.