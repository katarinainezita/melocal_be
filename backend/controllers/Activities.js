import Activities from "../models/ActivityModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getActivities = async(req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Activities.findAll({
                attributes:['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'kontak_pengelola'],
                include:[{
                    model: Users, 
                    attributes:['nama','email']
                }]
            });
        } else {
            response = await Activities.findAll({
                attributes:['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'kontak_pengelola'],
                where:{
                    userId: req.userId
                },
                include:[{
                    model: Users,
                    attributes:['nama','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getActivityById = async(req, res) => {
    try {
        const activity = await Activities.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!activity) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Activities.findOne({
                attributes:['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'kontak_pengelola'],
                where: {
                    id: activity.id
                },
                include:[{
                    model: Users, 
                    attributes:['nama','email']
                }]
            });
        } else {
            response = await Activities.findOne({
                attributes:['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'kontak_pengelola'],
                where:{
                    [Op.and]:[{id: activity.id}, {userId: req.userId}]   
                },
                include:[{
                    model: Users,
                    attributes:['nama','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createActivity = async(req, res) => {
    const { nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola} = req.body;
    try {
        await Activities.create({
            nama: nama,
            deskripsi: deskripsi,
            harga: harga,
            fitur: fitur,
            bintang: bintang,
            lokasi: lokasi,
            kontak_pengelola: kontak_pengelola,
            userId: req.userId
        });
        res.status(201).json({msg: "Activity Created Successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateActivity = async(req, res) => {
    try {
        const activity = await Activities.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!activity) return res.status(404).json({msg: "Data tidak ditemukan"});
        const { nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola} = req.body;
        if(req.role === "admin"){
            await Activities.update({
                nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola
            },{
                where:{
                    id: activity.id
                }
            });
        } else {
            if(req.userId !== activity.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Activities.update({
                nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola
            },{
                where:{
                    [Op.and]:[{id: activity.id}, {userId: req.userId}]   
                }
            });
        }
        res.status(200).json({msg: "Product Updated Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteActivity = async(req, res) => {
    try {
        const activity = await Activities.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!activity) return res.status(404).json({msg: "Data tidak ditemukan"});
        const { nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola} = req.body;
        if(req.role === "admin"){
            await Activities.destroy({
                where:{
                    id: activity.id
                }
            });
        } else {
            if(req.userId !== activity.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Activities.destroy({
                where:{
                    [Op.and]:[{id: activity.id}, {userId: req.userId}]   
                }
            });
        }
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}