const mongoose = require('mongoose');

async function main() {
    if (!process.env.DB_CONNECT_STRING) {
        throw new Error("DB_CONNECT_STRING environment variable is not defined");
    }
    await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log("MongoDB Connected");
}

module.exports = main;
