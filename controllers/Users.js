import Users from "../models/UserModel.js";
import argon2 from "argon2";


export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes:['id', 'nama', 'email', 'no_telp', 'melocal_points', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
        
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes:['id', 'nama', 'email', 'no_telp', 'melocal_points','role'],            
            where: {
                id : req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
        
    }
}

export const getUserByEmail = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes:['id', 'nama', 'email', 'no_telp', 'melocal_points', 'role'],            
            where: {
                email : req.params.email
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
        
    }
}

export const createUser = async(req, res) => {
    const {nama, email, no_telp, password, confirm_password, role} = req.body;
    if(password !== confirm_password) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"})
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            nama: nama,
            email: email,
            no_telp: no_telp,
            password: hashPassword,
            melocal_points: 0,
            role: role
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

export const createUserMitra = async(req, res) => {
    const {nama, email, no_telp, password, confPassword} = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"})
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            nama: nama,
            email: email,
            no_telp: no_telp,
            password: hashPassword,
            melocal_points: 0,
            role: 'mitra'
        });
        res.status(201).json({msg: "Register Berhasil"});
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

export const updateUser = async(req, res) => {
    const user = await Users.findOne({
            where: {
                id : req.params.id
            }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const {nama, email, no_telp, password, confPassword, melocal_points, role} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    // if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"})
    try {
        await Users.update({
            nama: nama,
            email: email,
            no_telp: no_telp,
            password: hashPassword,
            melocal_points: melocal_points, 
            role: role
        }, {
            where:{
                id: user.id
            }
        });
        const response = await Users.findOne({
            attributes:['id', 'nama', 'email', 'no_telp', 'melocal_points','role'],            
            where: {
                id : user.id
            }
        });
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}

export const deleteUser = async(req, res) => {
    const user = await Users.findOne({
            where: {
                id : req.params.id
            }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    try {
        await Users.destroy({
            where:{
                id: user.id
            }
        });
        res.status(200).json({msg: "User Berhasil di Delete"});
    } catch (error) {
        res.status(400).json({
            msg: error.message
        });
    }
}