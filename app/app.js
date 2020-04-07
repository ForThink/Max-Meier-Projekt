const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const route = require("./routes/route");
const path = require("path");
const users = require("./routes/users");
const text = require("./routes/text");
const rankings = require("./routes/rankings");
const questions = require("./routes/questions");
app.use(bodyParser.json());
app.use("/", express.static("./htdocs"));
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})
app.use("/users", users);
app.use("/exampleroute", route);
app.use("/questions", questions);
app.use("/rankings", rankings);
app.use("/text", text);
app.get("*", (req, res)=>{
    res.sendFile(path.resolve("./htdocs/index.html"));
})
module.exports=app;
