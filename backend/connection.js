const mongoose = require("mongoose")

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("database is on")
    } catch (error) {
        console.log(error);;
    }
}

module.exports = connection