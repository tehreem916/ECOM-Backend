const mongoose = require("mongoose");
const dns = require("dns");

const connectDatabase = () => {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    mongoose
        .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = connectDatabase;