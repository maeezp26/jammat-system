const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {

  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (!admin) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (admin.password !== password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });

};