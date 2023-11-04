import Sesis from "../models/SesiModel.js";
import Activities from "../models/ActivityModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";
import { MelocalException, StatusResponse } from "../utils/Response.js";

export const getSesiByActivitesId = async(req, res) => {
    try {
      const activites = await Activities.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!activites) return MelocalException(res, 404, 'activity tidak ditemukan', StatusResponse.ERROR, null)

      let response = await Sesis.findAll({
              attributes:['id', 'nama', 'tanggal', 'mulai', 'selesai', 'slot_maks', 'slot_booked'],
              where:{
                  activityId: activites.id
              },
              include:[{
                  model: Activities,
                  attributes:['nama','harga', 'lokasi']
              }]
          });
      return MelocalException(res, 200, 'sesi berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const getSesiById = async(req, res) => {
    try {
        const sesi = await Sesis.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!sesi) return MelocalException(res, 400, 'data tidak ditemukan', StatusResponse.ERROR, null);
        let response = await Sesis.findAll({
                attributes:['id', 'nama', 'tanggal', 'mulai', 'selesai', 'slot_maks', 'slot_booked'],
                where:{
                    id: sesi.id
                },
                include:[{
                    model: Activities,
                    attributes:['nama','harga', 'lokasi']
                }]
            });
        return MelocalException(res, 200, 'sesi berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const createSesi = async(req, res) => {
    const {nama, tanggal, mulai, selesai, slot_maks, activity_id} = req.body;
    try {

      const activites = await Activities.findOne({
        where: {
          id: activity_id
        }
      });

      if (!activites) return MelocalException(res, 404, 'activity tidak ditemukan', StatusResponse.ERROR, null)

      const creator = await Users.findOne({
        where: {
          id: req.userId,
        },
      });

      if (!creator) return MelocalException(res, 404, 'user tidak ditemukan', StatusResponse.ERROR, null)

      if (creator.id !== activites.userId) return MelocalException(res, 401, 'anda tidak memiliki akses', StatusResponse.ERROR, null)

      await Sesis.create({
          nama: nama,
          tanggal: tanggal,
          mulai: mulai,
          selesai: selesai,
          slot_maks: slot_maks,
          slot_booked: 0,
          activityId: activity_id
      });

      const respone = { nama, tanggal, mulai, selesai, slot_maks, slot_booked: 0, activity_id}
      return MelocalException(res, 200, 'sesi berhasil dibuat', StatusResponse.SUCCESS, respone)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const updateSesi = async(req, res) => {
      try {
          const sesi = await Sesis.findOne({
              where: {
                  id: req.params.id
              },
              include:[{
                model: Activities,
                attributes: ['userId']
              }]
          })
          if (!sesi) return MelocalException(res, 404, 'data tidak ditemukan', StatusResponse.ERROR, null);
        
          const user = await Users.findOne({
            where: {
              id: req.userId,
            },
          });

          if (!user) return MelocalException(res, 404, 'user tidak ditemukan', StatusResponse.ERROR, null)

          if (user.id !== sesi.activity.userId) return MelocalException(res, 401, 'anda tidak memiliki akses', StatusResponse.ERROR, null)
        
          const {nama, tanggal, mulai, selesai, slot_maks, slot_booked} = req.body;
          await Sesis.update({
                  nama, tanggal, mulai, selesai, slot_maks, slot_booked
              },{
                  where:{
                      id: sesi.id  
                  }
              });
              
        const response = { nama, tanggal, mulai, selesai, slot_maks, slot_booked }
        return MelocalException(res, 200, 'sesi berhasil diupdate', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const deleteSesi = async(req, res) => {
    try {
        const sesi = await Sesis.findOne({
            where: {
                id: req.params.id
            },
            include:[{
              model: Activities,
              attributes: ['userId']
            }]
        })
        if (!sesi) return MelocalException(res, 400, 'data tidak ditemukan', StatusResponse.ERROR, null);
      
        if (sesi.activity.userId !== req.userId) return MelocalException(res, 401, 'anda tidak memiliki akses', StatusResponse.ERROR, null)
        
        await Sesis.destroy({
                where:{
                    id: sesi.id  
                }
        });
        return MelocalException(res, 200, 'sesi berhasil dihapus', StatusResponse.SUCCESS, null)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}
