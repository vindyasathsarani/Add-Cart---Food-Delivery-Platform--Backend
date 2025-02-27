import Customer from "../models/customerModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new customer
export const registerCustomer = async (req, res) => {
    const { fname, lname, nic, phone, email, no, street1, street2, city, imageUrl, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            fname,
            lname,
            nic,
            phone,
            email,
            no,
            street1,
            street2,
            city,
            imageUrl,
            password: hashedPassword,
        });

        await newCustomer.save();
        res.json("Customer Added");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// Fetch all customers
export const fetchCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

// Update customer details
export const updateCustomer = async (req, res) => {
    const Nic = req.params.nic;
    const { fname, lname, nic, phone, email, no, street1, street2, city, imageUrl, password, confirmPassword } = req.body;

    const updateCustomer = {
        fname,
        lname,
        nic,
        phone,
        email,
        no,
        street1,
        street2,
        city,
        imageUrl,
        password,
        confirmPassword,
    };

    try {
        const updatedCustomer = await Customer.findOneAndUpdate({ nic: Nic }, updateCustomer, { new: true });

        if (!updatedCustomer) {
            return res.status(404).json({ status: "Customer not found" });
        }

        res.status(200).json({ status: "Customer Updated successfully", updatedCustomer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "Error with updating data" });
    }
};

// Customer login
export const loginCustomer = async (req, res) => {
    try {
        const { nic, password } = req.body;

        if (!nic || !password) {
            return res.status(400).json({ message: "NIC and password are required" });
        }

        if (nic === "200028301681" && password === "12345678@") {
            const adminToken = jwt.sign({ role: "admin" }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ message: "Admin login successful", token: adminToken });
        }

        const user = await Customer.findOne({ nic });

        if (!user) {
            return res.status(401).json({ message: "Invalid NIC or password" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid NIC or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.status(200).json({ message: `${nic} login successfully`, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
