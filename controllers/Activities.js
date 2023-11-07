import Activities from "../models/ActivityModel.js";
import Users from "../models/UserModel.js";
import Images from "../models/ImageModel.js";
import { Op } from "sequelize";
import { MelocalException, StatusResponse } from "../utils/Response.js";
import { TypesImages } from "../constants/Constants.js";

export const getActivities = async(req, res) => {
    try {
      let activities = await Activities.findAll({
        attributes: ['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'nama_tourguide', 'kontak_tourguide'],
        include: [
          {
            model: Users,
            attributes: ['id']
          }
        ]
      });

      let images;
      for(const activity of activities) {
        images = await Images.findAll({
          attributes: ['id','url'],
          where: {
            key: activity.id,
            types: TypesImages.ACTIVITIES
          }
        });

        activity.setDataValue('images', images);
      }

      const response = activities;

      return MelocalException(res, 200, 'activity berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const getActivitiesByMitraId = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return MelocalException(res, 404, 'user tidak ditemukan', StatusResponse.ERROR, null);
    }

    let activities = await Activities.findAll({
      attributes: ['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'nama_tourguide', 'kontak_tourguide'],
      where: {
        userId: user.id
      },
      include: [
        {
          model: Users,
          attributes: ['id']
        }
      ]
    });

    if(!activities) return MelocalException(res, 400, 'activity tidak ditemukan', StatusResponse.ERROR, null);

    let images;
    for(const activity of activities) {
      images = await Images.findAll({
        attributes: ['id','url'],
        where: {
          key: activity.id,
          types: TypesImages.ACTIVITIES
        }
      });

      activity.setDataValue('images', images);
    }

    const response = activities;

    return MelocalException(res, 200, 'activity berhasil ditemukan', StatusResponse.SUCCESS, response);
  } catch (error) {
    console.log(error);
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null);
  }
}

export const getActivityById = async(req, res) => {
    try {
        const activity = await Activities.findOne({
            where: {
                id: req.params.id
            }
        })
      
        if (!activity) return MelocalException(res, 400, 'data activity tidak ditemukan', StatusResponse.ERROR, null)
      
        const user = await Users.findOne({
          where: {
            id: req.userId,
          },
        });

        if(!user) return MelocalException(res, 400, 'user tidak ditemukan', StatusResponse.ERROR, null)
       
        const response = await Activities.findOne({
            attributes:['id', 'nama', 'deskripsi', 'harga', 'fitur', 'bintang', 'lokasi', 'nama_tourguide', 'kontak_tourguide'],
            where: {
                id: activity.id
            },
            include:[{
                model: Users, 
                attributes:['id']
            }]
        });
        
        let images = await Images.findAll({
          attributes: ['id','url'],
          where: {
            key: response.id,
            types: TypesImages.ACTIVITIES
          }
        });
      
        response.setDataValue('images', images);
      
        return MelocalException(res, 200, 'activity berhasil ditemukan', StatusResponse.SUCCESS, response)
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const createActivity = async(req, res) => {
  const { nama, deskripsi, harga, fitur, lokasi, nama_tourguide, kontak_tourguide } = req.body;
  const files = req.files
  try {
      const data = await Activities.create({
          nama: nama,
          deskripsi: deskripsi,
          harga: harga,
          fitur: fitur,
          bintang: 0,
          lokasi: lokasi,
          nama_tourguide: nama_tourguide,
          kontak_tourguide: kontak_tourguide,
          userId: req.userId
      });
    
      let array_image = [];
      // Save image to database
      for (const file of files) {
        array_image.push(file.filename);
        await Images.create({
          nama: file.originalname,
          url: file.filename,
          types: TypesImages.ACTIVITIES,
          key: data.id
        });
      }
      
      const response = { nama, deskripsi, harga, fitur, lokasi, nama_tourguide, kontak_tourguide, array_image}
      return MelocalException(res, 200, 'activity berhasil dibuat', StatusResponse.SUCCESS, response)
  } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
}

export const updateActivity = async(req, res) => {
  try {
      const activity = await Activities.findOne({
          where: {
              id: req.params.id
          }
      })
      
      if (!activity) return MelocalException(res, 400, 'data activity tidak ditemukan', StatusResponse.ERROR, null)
      
      const user = await Users.findOne({
        where: {
          id: req.userId,
        },
      });

      if (!user) return MelocalException(res, 404, 'user tidak ditemukan', StatusResponse.ERROR, null)
      
      if (user.id !== activity.userId) return MelocalException(res, 403, 'anda tidak memiliki akses', StatusResponse.ERROR, null)
      const { nama, deskripsi, harga, fitur, bintang, lokasi, nama_tourguide, kontak_tourguide} = req.body;
      await Activities.update
      ({
          nama, deskripsi, harga, fitur, bintang, lokasi, nama_tourguide, kontak_tourguide
      },{
          where:{
              id: activity.id   
          }
      });
    
      const response = {nama, deskripsi, harga, fitur, bintang, lokasi, nama_tourguide, kontak_tourguide}
      return MelocalException(res, 200, 'activity berhasil diupdate', StatusResponse.SUCCESS, response)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

export const deleteActivity = async(req, res) => {
    try {
      const activity = await Activities.findOne({
          where: {
              id: req.params.id
          }
      })
      
      if (!activity) return MelocalException(res, 400, 'data activity tidak ditemukan', StatusResponse.ERROR, null)
      
      const user = await Users.findOne({
        where: {
          id: req.userId,
        },
      });
      if(user.id !== activity.userId) return MelocalException(res, 403, 'anda tidak memiliki akses', StatusResponse.ERROR, null)
      await Activities.destroy({
          where:{
              [Op.and]:[{id: activity.id}, {userId: user.id}]   
          }
      });
      return MelocalException(res, 200, 'activity berhasil dihapus', StatusResponse.SUCCESS, null)
    } catch (error) {
      return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}

// export const panigationActivity = async(req, res) => {
//     const page = Number.parseInt(req.query.page);
//     const size = Number.parseInt(req.query.size);
    
//     try {
//         const activity = await Activities.findAndCountAll({
//             limit: size,
//             offset: (page-1) * size,
            
//         })
//         if(!activity) return res.status(404).json({message: "Data tidak ditemukan"});
//         const { nama, deskripsi, harga, fitur, bintang, lokasi, kontak_pengelola} = req.body;
//         if(req.role === "admin"){
//             await Activities.destroy({
//                 where:{
//                     id: activity.id
//                 }
//             });
//         } else {
//             if(req.userId !== activity.userId) return res.status(403).json({message: "Akses terlarang"});
//             await Activities.destroy({
//                 where:{
//                     [Op.and]:[{id: activity.id}, {userId: req.userId}]   
//                 }
//             });
//         }
//         res.status(200).json({message: "Product Deleted Successfully"});
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// }