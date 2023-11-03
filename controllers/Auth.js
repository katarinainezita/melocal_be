import Users from "../models/UserModel.js";
import argon2 from "argon2";
import { generateToken } from "../middleware/AuthUser.js";
import { MelocalException, StatusResponse } from "../utils/Response.js";

export const login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return MelocalException(res, 404, 'user tidak ditemukan', StatusResponse.ERROR, null)

  const matchUser = await argon2.verify(user.password, req.body.password);

  if (!matchUser) {
    return MelocalException(res, 404, 'password tidak sama', StatusResponse.ERROR, null)
  }

  const token = await generateToken(user);
  const data = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    no_telp: user.no_telp,
    melocal_points: user.melocal_points,
    role: user.role,
    token: token,
  };
  
  return MelocalException(res, 200, 'login berhasil', StatusResponse.SUCCESS, data)
};


export const logout = async(req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({message: "Tidak dapat logout"});
        res.status(200).json({message: "Anda telah logout"})
    });
}

export const me = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const data = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      no_telp: user.no_telp,
      melocal_points: user.melocal_points,
      role: user.role,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}