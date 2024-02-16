# Cartesify Backend

This package is intended to be used with [@calindra/cartesify](https://www.npmjs.com/package/@calindra/cartesify).


```js
// Cartesify REST bridge
const { CartesifyBackend } = require("@calindra/cartesify-backend")

CartesifyBackend.createDapp().then(dapp => {
    dapp.start().catch((e) => {
        console.error(e);
        process.exit(1);
    });
});

// Normal nodejs application using express
const express = require("express");

const app = express();
const port = 8383;

app.use(express.json());

app.post("/your-endpoint", (req, res) => {
    const senderAddress = req.header("x-msg_sender");
    res.send({ some: "response", senderAddress });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
```