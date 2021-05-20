require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const port = process.env.PORT || 3002;
//API security
app.use(helmet());

//handle CORS error
app.use(cors());


//MongoDB Connection Setup
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

if (process.env.NODE_ENV !== 'production') {
    const mDb = mongoose.connection;
    mDb.on("open", () => {
        console.log('MongoDB is connected');
    })

    mDb.on("error", () => {
        console.log(error);
    })

    //Logger
    app.use(morgan("tiny"));
}



//Set body bodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//Load routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");


app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);


app.use('*', (req, res, next) => {
    const error = new Error('Ressources not found')
    error.status = 404

    next(error)
})

app.use((error, req, res, next) => {
    handleError(error, res);
})

//Error handler

const handleError = require("./src/utils/errorHandler");

app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);

})