const { logEvents } = require('./logger')

const errorHandler = (err, req, res, nest) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t
        ${req.header.origin}`,'errLog.log')
        console.log(err.stack)

        const status = res.statuscode ? res.statuscode : 500 //server err

        res.status(status)

        res.json({ message: err.message})
}

module.exports = errorHandler 