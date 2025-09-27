const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const app = express()
require('./config/Db')
const AuthRouter = require('./Router/AuthRouter')
const port = 3001;

// main app 
app.use(bodyParser.json());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use('/', AuthRouter)

app.listen(port, () => {
    console.log(`server listern on port: ${port}`);

})