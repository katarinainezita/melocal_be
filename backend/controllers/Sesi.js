import Sesis from "../models/SesiModel.js";
import Activities from "../models/ActivityModel.js";
import { Op } from "sequelize";

// export const getSesi = async(req, res) => {
//     try {
//         let response = await Sesis.findAll({
//                 attributes:['nama', 'tanggal', 'mulai', 'selesai', 'slot_maks', 'slot_booked'],
//                 where:{
//                     activityId: req.activityId
//                 },
//                 include:[{
//                     model: Activities,
//                     attributes:['nama','harga', 'lokasi']
//                 }]
//             });
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

export const getSesiById = async(req, res) => {
    const {activityId} = req.params;

    try {
        const sesi = await Sesis.findAll({
            where: {
                activityId: activityId
            }
            
        })
        if(!sesi) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response = await Sesis.findAll({
                attributes:['nama', 'tanggal', 'mulai', 'selesai', 'slot_maks', 'slot_booked'],
                where:{
                    activityId: activityId 
                },
                include:[{
                    model: Activities,
                    attributes:['nama','harga', 'lokasi']
                }]
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createSesi = async(req, res) => {
    const {activityId} = req.params;
    const {nama, tanggal, mulai, selesai, slot_maks, slot_booked} = req.body;
    try {
        await Sesis.create({
            nama: nama,
            tanggal: tanggal,
            mulai: mulai,
            selesai: selesai,
            slot_maks: slot_maks,
            slot_booked: slot_booked,
            activityId: activityId
        });
        res.status(201).json({msg: "Transaction Created Successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateSesi = async(req, res) => {
    try {
        const sesi = await Sesis.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!sesi) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {nama, tanggal, mulai, selesai, slot_maks, slot_booked} = req.body;
        await Sesis.update({
                nama, tanggal, mulai, selesai, slot_maks, slot_booked
            },{
                where:{
                    id: sesi.id  
                }
            });
        res.status(200).json({msg: "Sesi Updated Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteSesi = async(req, res) => {
    try {
        const sesi = await Sesis.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!sesi) return res.status(404).json({msg: "Data tidak ditemukan"});
        await Sesis.destroy({
                where:{
                    id: sesi.id  
                }
        });
        res.status(200).json({msg: "Sesi Deleted Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
