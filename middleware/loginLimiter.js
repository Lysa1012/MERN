const rateLimit = require('express-rate-limit')
const { logEvent } = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message:{
        message: 'Too many login attemps from this IP, please try again after a 60 second pause'
    },
    handler: (req,res,next,options) => {
        logEvent(`Too many reques: ${options.message.message}\t${req.method}\t${req.url}\t${req.header.origin}`,'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders:false,
})

module.exports = loginLimiter