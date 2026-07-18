const express = require('express')
const cors = require('cors')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const config = require('./config/env')

const userRoutes = require("./routes/userRoutes")
const parcelRoutes = require("./routes/parcelRoutes")
const riderRoutes = require("./routes/riderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express()

app.use(cors({ origin: config.clientUrl, credentials: true}))
app.use(express.json())

app.get('/', (req,res)=>{
    res.json({success: true, message: 'Dispatch server is running'})
})

// routers get mounted here later
app.use('/api/users', userRoutes);
app.use('/api/parcels', parcelRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/payments", paymentRoutes);


// order matters: 404 after all routes, error handler LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;