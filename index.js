const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors")
const path = require('path')
const route = require('./routes/route');
// const MongoDB = require("./db/db");
// MongoDB()

app.enable('trust proxy')
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }));
app.use('/api', route)
app.use(express.static(path.join(__dirname, 'build')))

//render website
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
//create the server


  app.listen(PORT, () => {
    console.log("server running in port " + PORT);
  })
