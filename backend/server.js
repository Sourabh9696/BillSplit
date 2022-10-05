const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();
const app = express()

// middleware
app.use(express.json())
app.use(cors())

app.use(express.urlencoded({ extended: true }))


// routers
app.use(require('./routes/userRouter.js'));
app.use(require('./routes/billRouter.js'));


// request to handle undefined or all other routes
app.get("*", function(req, res) {
  res.send("App works!!!!!");
 })
//port
const PORT = process.env.PORT || 3000
//server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})