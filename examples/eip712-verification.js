const express = require('express');
const { CartesifyBackend, VerifyEIP712 } = require('@calindra/cartesify-backend');

// Create Express application
const app = express();
const port = 8383;

// Parse JSON requests
app.use(express.json());

// Start Cartesify backend
CartesifyBackend.createDapp().then(dapp => {
    dapp.start().catch((e) => {
        console.error("Error starting Cartesify DApp:", e);
        process.exit(1);
    });
});

// Example of a protected route that requires EIP-712 signature
app.post("/secured-action", async (req, res) => {
    try {
        // Access the sender address (added by Cartesify)
        const senderAddress = req.header("x-msg_sender");
        
        // Access the EIP-712 signature and typed data (would be included in the request)
        const { signature, typedData: typedDataBase64 } = req.body;
        
        if (!signature || !typedDataBase64) {
            return res.status(400).json({ error: "Missing signature or typed data" });
        }
        
        // Parse the base64 encoded typed data
        const typedData = VerifyEIP712.parseTypedData(typedDataBase64);
        
        // Verify that the signature matches the typed data and get the signer address
        const recoveredAddress = await VerifyEIP712.verifySigner(typedData, signature);
        
        // Check if the recovered address matches the sender address
        if (recoveredAddress.toLowerCase() !== senderAddress.toLowerCase()) {
            return res.status(401).json({ error: "Invalid signature" });
        }
        
        // Proceed with the secured action
        console.log(`Authenticated request from ${senderAddress}`);
        
        // Handle the request data
        const { action, parameters } = req.body;
        
        // Return a response
        res.json({
            success: true,
            message: `Action '${action}' processed successfully`,
            sender: senderAddress
        });
    } catch (error) {
        console.error("Error in secured action:", error);
        res.status(500).json({ error: "Failed to process secured action" });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

// Start the Express server
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});