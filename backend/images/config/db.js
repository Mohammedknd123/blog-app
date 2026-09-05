const mongoose = require('mongoose')

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CLOUD_URI)
        console.log('Connected to MongoDB ✅')
    } catch (error) {
        console.log('Connection Failed ❌', error)
    }
}