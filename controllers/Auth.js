import Users from "../models/UserModel.js";
import argon2 from "argon2";


export const Login = async(req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
    const matchUser = await argon2.verify(user.password, req.body.password);
    if(!matchUser) {
        return res.status(400).json({msg: "Wrong password"});
    }
    req.session.userId = user.id;
    const id = user.id;
    const nama = user.nama;
    const email = user.email;
    const no_telp = user.no_telp;
    const melocal_points = user.melocal_points;
    const role = user.role;
    res.status(200).json({id, nama, email, no_telp, melocal_points, role});
}

export const Me = async (req, res) => {
    if (!req.session.userId ) {
      return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
    }

  console.log(req.session.userId)
    const user = await Users.findOne({
        attributes: ['id', 'nama', 'email', 'no_telp', 'melocal_points', 'role'],
        where: {
          id: req.session.userId
        }
      });
      if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
      res.status(200).json(user);
    
  };



export const logOut = async(req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Tidak dapat logout"});
        res.status(200).json({msg: "Anda telah logout"})
    });
}