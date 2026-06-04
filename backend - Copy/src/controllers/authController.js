import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password, dateOfBirth, gender, weight, height } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email, dan password wajib diisi!"
            });
        }
        const sanitizedEmail = email.toLowerCase().trim();

        // 1. Cek apakah email sudah ada lewat UserModel
        const existingUser = await UserModel.findByEmail(sanitizedEmail);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar!"
            });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Simpan ke database via UserModel (Tanpa foto dulu saat register default-nya null)
        const newUser = await UserModel.create({
            username: username.trim(),
            email: sanitizedEmail,
            password: hashedPassword,
            dateOfBirth: dateOfBirth || null,
            gender: gender || null,
            weight: weight ? Number(weight) : null,
            height: height ? Number(height) : null
        });

        res.status(201).json({
            success: true,
            message: "Registrasi EatWise Berhasil!",
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan server", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email dan password wajib diisi!" });
        }

        const sanitizedEmail = email.toLowerCase().trim();

        const user = await UserModel.findByEmail(sanitizedEmail);
        if (!user) {
            return res.status(401).json({ success: false, message: "Email atau password salah!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Email atau password salah!" });
        }

        //Buat Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'eatwise_2026',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: "Login Berhasil!",
            token,
            user: {
                username: user.username,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                weight: user.weight,
                height: user.height
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan server", error: error.message });
    }
};