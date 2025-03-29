const express = require("express")


const app = express();

app.use("/test", (req, res) => {
    res.send("Response is test!")
})

app.use("/res", (req, res) => {
    res.send("Response is res!")
})

app.listen(3005, () => {
    console.log("server is listening on 3005!")
})