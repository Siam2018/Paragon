import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AdminModel from '../models/adminmodel.js';

const adminRegister = async (request, response) => {
    try {
        const { FullName, Email, Password } = request.body;
        if (!FullName || !Email || !Password) {
            return response.status(400).send({ message: "All fields are required." });
        }
        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ Email });
        if (existingAdmin) {
            return response.status(409).send({ message: "Admin already exists." });
        }
        // Create new admin
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newAdmin = new AdminModel({ FullName, Email, Password: hashedPassword });
        // Save the new admin
        await newAdmin.save();
        // Do not send password in response
        const { Password: _, ...adminData } = newAdmin.toObject();
        response.status(201).send(adminData);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: "Internal server error" });
    }
}

const adminSignin = async (request, response) => {
    try {
        const { Email, Password } = request.body;
        if (!Email || !Password) {
            return response.status(400).send({ message: "Email and password are required." });
        }
        // Authenticate user
        const admin = await AdminModel.findOne({ Email });
        const isPasswordValid = admin ? await bcrypt.compare(Password, admin.Password) : false;
        if (!admin || !isPasswordValid) {
            return response.status(401).send({ message: "Invalid email or password." });
        }
        // Generate token
        const token = jwt.sign({ id: admin._id, Email: admin.Email }, process.env.JWT_SECRET, { expiresIn: "2h" });
        return response.status(200).send({ token , admin: { FullName: admin.FullName, Email: admin.Email } });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
}

export default { adminRegister, adminSignin };