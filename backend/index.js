import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import ActivityRoute from "./routes/ActivityRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import TransactionRoute from "./routes/TransactionRoute.js"
import SesiRoute from "./routes/SesiRoute.js";
import ImageRoute from "./routes/ImageRoute.js";
import CartRoute from "./routes/CartRoute.js";
import DetailRoute from "./routes/Detail_transactionRoute.js"

import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
dotenv.config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
})

const app = express();

// (async() => {
//     await db.sync();
// })();


app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(UserRoute);
app.use(ActivityRoute);
app.use(AuthRoute);
app.use(TransactionRoute);
app.use(SesiRoute);
app.use(ImageRoute);
app.use(CartRoute);
app.use(DetailRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
