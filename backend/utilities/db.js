const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {dbName: 'PolyIDE'});
        console.log(`DB connected.`)
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


module.exports = {connectDB};