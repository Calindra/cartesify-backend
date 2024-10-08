console.log('starting app.js...')
const { CartesifyBackend } = require("@calindra/cartesify-backend")

let dapp
CartesifyBackend.createDapp().then(initDapp => {
    initDapp.start().then(() => {
        console.log('Dapp initialized')
    }).catch((e) => {
        console.error(e);
        process.exit(1);
    });
    dapp = initDapp
})

const express = require("express")

const app = express();
const port = 8383;
app.use(express.json());

let totalAmount = 0

let games = []

app.get("/health", (req, res) => {
    req.header("x-msg_sender")
    res.send({ some: "response" });
});

app.get("/params", (req, res) => {
    res.send(req.query);
});

app.post("/new-game", async (req, res) => {
    let player1 = req.header("x-msg_sender")
    let commit1 = req.body.commit // = hash(move + nonce)
    games.push({
        player1,
        commit1
    })
    res.send({ created: 1 })
})

app.post('/deposit', (req, res) => {
    axios.post('http://deroll/voucher')
})

app.get("/", (req, res) => {
    res.send({ some: "response" });
});

app.get('/games', (req, res) => {
    console.log('hi')
    res.send({ ok: 1 })
})

app.put('/update', (req, res) => {
    res.send({ updateBody: req.body })
})

app.patch('/patch', (req, res) => {
    res.send({ patchBody: req.body })
})

app.delete('/delete', (req, res) => {
    res.send({ query: req.query })
})

app.post('/player', (req, res) => {
    const name = req.body.name
    const id = req.user.id
    res.send({ msg: "created", player: { id, name } })
})

app.post('/games', (req, res) => {
    req.body.startBid
    res.send({ msg: "game created" })
})

app.post('/hit', (req, res) => {
    // req.user.id === 'msg_sender'
    if (!Number.isNaN(+req.body.amount)) {
        totalAmount += +req.body.amount
    }
    res.send({ amount: totalAmount, myPost: req.body });
});

app.post('/echo', (req, res) => {
    res.send({ myPost: req.body });
});

app.post('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
});

app.get('/echo/headers', (req, res) => {
    res.send({ headers: req.headers });
})

app.get('/old-path', (req, res) => {
    res.redirect(301, '/new-path');
})

app.get('/new-path', (req, res) => {
    res.send({ message: 'You have been redirected to the new path.', path: req.url });
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
