const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    console.log("MongoDB Connected");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
        username: "admin",
        password: hashedPassword
    });

    await admin.save();

    console.log("Default Admin Created");

    process.exit();

})
.catch(err => {
    console.log(err);
    process.exit(1);
});