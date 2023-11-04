import Users from "../models/UserModel.js";
import argon2 from "argon2";
import { MelocalException, StatusResponse } from "../utils/Response.js";


export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes:['id', 'nama', 'email', 'no_telp', 'melocal_points', 'role']
        });
        return MelocalException(res, 200, 'user berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
        
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
        return MelocalException(res, 200, 'user berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
        
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
        return MelocalException(res, 200, 'user berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const createUser = async(req, res) => {
    const {nama, email, no_telp, password, confirm_password, role} = req.body;
    if (password !== confirm_password) return MelocalException(res, 400, 'password dan confirm password tidak cocok', StatusResponse.ERROR, null)
    const checkEmail = await Users.findOne({
      where: {
        email: email
      }
    });

    if (checkEmail && checkEmail.role == 'user') return MelocalException(res, 400, 'email sudah terdaftar', StatusResponse.ERROR, null)
    
    const hashPassword = await argon2.hash(password);
    try {
      await Users.create({
          nama: nama,
          email: email,
          no_telp: no_telp,
          password: hashPassword,
          melocal_points: 0,
          role: 'user'
      });
        
      const data = {
        nama: nama,
        email: email,
        no_telp: no_telp,
        melocal_points: 0,
        role: 'user'
      }
      
      return MelocalException(res, 201, 'register berhasil', StatusResponse.SUCCESS, data)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const createUserMitra = async(req, res) => {
    const {nama, email, no_telp, password, confirm_password} = req.body;
    
    const checkEmail = await Users.findOne({
      where: {
        email: email
      }
    });

    if (checkEmail && checkEmail.role == "mitra") return MelocalException(res, 400, 'email sudah terdaftar', StatusResponse.ERROR, null)
  
    if(password !== confirm_password) return MelocalException(res, 400, 'password dan confirm password tidak cocok', StatusResponse.ERROR, null)
    
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
        
        const data = {
          nama: nama,
          email: email,
          no_telp: no_telp,
          melocal_points: 0,
          role: 'mitra'
        }
        return MelocalException(res, 201, 'register berhasil', StatusResponse.SUCCESS, data)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const updateUser = async(req, res) => {
    const user = await Users.findOne({
            where: {
                id : req.userId
            }
    });
    if(!user) return MelocalException(res, 400, 'user tidak ditemukan', StatusResponse.ERROR, null)
    const {nama, email, no_telp, password, melocal_points} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    // if(password !== confPassword) return res.status(400).json({message: "Password dan Confirm Password tidak cocok"})
    try {
        await Users.update({
            nama: nama,
            email: email,
            no_telp: no_telp,
            password: hashPassword,
            melocal_points: melocal_points, 
        }, {
            where:{
                id: user.id
            }
        });
      
        const response = {nama, email, no_telp, melocal_points, role: user.role}
        return MelocalException(res, 200, 'user berhasil diupdate', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const deleteUser = async(req, res) => {
    const user = await Users.findOne({
            where: {
                id : req.params.userId
            }
    });
    if(!user) return MelocalException(res, 400, 'user tidak ditemukan', StatusResponse.ERROR, null)
    try {
        await Users.destroy({
            where:{
                id: user.id
            }
        });
        return MelocalException(res, 200, 'user berhasil dihapus', StatusResponse.SUCCESS, null)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}