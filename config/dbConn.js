const mongoose = require('mongoose')

const connectDB = async() => {
    try{
        console.log(process.env.DATABASE_URI)
        await mongoose.connect(process.env.DATABASE_URI)
    } catch(err){
        console.log(err)
    }
}
module.exports  = connectDB