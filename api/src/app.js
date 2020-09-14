const express = require("express");
require("./db/mongoose");
const pharmacyRouter = require("./routers/pharmacyRouter");

const app = express();

app.use(express.json());
app.use(pharmacyRouter);

module.exports = app;