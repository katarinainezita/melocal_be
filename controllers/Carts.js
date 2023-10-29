// import Carts from "../models/CartModel.js";
// import Users from "../models/UserModel.js";
// import Sesis from "../models/SesiModel.js";
// import { Op } from "sequelize";

// export const getCarts = async(req, res) => {
//     try {
//         let response;
//         if(req.role === "admin"){
//             response = await Carts.findAll({
//                 attributes:['id'],
//                 include:[
//                     {
//                         model: Users, 
//                         attributes:['nama','email']
//                     },
//                     {
//                         model: Sesis,
//                         attributes:['nama']
//                     }
//                 ]
//             });
//         } else {
//             response = await Carts.findAll({
//                 attributes:['id'],
//                 where:{
//                     userId: req.userId
//                 },
//                 include:[
//                     {
//                         model: Users,
//                         attributes:['nama','email']
//                     },
//                     {
//                         model: Sesis,
//                         attributes:['nama']
//                     }
//                 ]
//             });
//         }
//         res.status(200).json(response);
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }


// // // By User Id masih bingung penerapannya
// // export const getCartById = async(req, res) => {
// //     const {userId} = req.userId;
    
// //     try {
// //         const cart = await Carts.findAll({
// //             where: {
// //                 userId: userId
// //             }
// //         })
// //         if(!cart) return res.status(404).json({msg: "Data tidak ditemukan"});
// //         let response;
// //         if(req.role === "admin"){
// //             response = await Carts.findAll({
// //                 attributes:['id'],
// //                 where: {
// //                     userId: userId
// //                 },
// //                 include:[
// //                     {
// //                         model: Users, 
// //                         attributes:['nama','email']
// //                     },
// //                     {
// //                         model: Sesis,
// //                         attributes:['nama']
// //                     }
// //                 ]
// //             });
// //         } else {
// //             response = await Carts.findAll({
// //                 attributes:['id'],
// //                 where:{
// //                     [Op.and]:[{id:cart.id}, {userId: userId}]   
// //                 },
// //                 include:[{
// //                         model: Users, 
// //                         attributes:['nama','email']
// //                     },
// //                     {
// //                         model: Sesis,
// //                         attributes:['nama']
// //                     }]
// //             });
// //         }
// //         res.status(200).json(response);
// //     } catch (error) {
// //         res.status(500).json({msg: error.message});
// //     }
// // }

// export const createCart = async(req, res) => {
//     const {sesisId} = req.params;
//     try {
//         await Carts.create({
//             userId: req.userId,
//             sesisId: sesisId

//         });
//         res.status(201).json({msg: "Cart Created Successfully"})
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

// // export const updateCart = async(req, res) => {
    
// //     try {
// //         const cart = await Carts.findOne({
// //             where: {
// //                 id: req.params.id
// //             }
            
// //         })
// //         if(!cart) return res.status(404).json({msg: "Data tidak ditemukan"});
// //         const {} = req.body;
// //         await Sesis.update({
// //                 nama, tanggal, mulai, selesai, slot_maks, slot_booked
// //             },{
// //                 where:{
// //                     id: sesi.id  
// //                 }
// //             });
// //         res.status(200).json({msg: "Sesi Updated Successfully"});
// //     } catch (error) {
// //         res.status(500).json({msg: error.message});
// //     }
// // }

// export const deleteCart = async(req, res) => {
//     try {
//         const cart = await Carts.findOne({
//             where: {
//                 id: req.params.id
//             }
            
//         })
//         if(!cart) return res.status(404).json({msg: "Data tidak ditemukan"});
//         await Carts.destroy({
//                 where:{
//                     id: cart.id  
//                 }
//         });
//         res.status(200).json({msg: "Sesi Deleted Successfully"});
//     } catch (error) {
//         res.status(500).json({msg: error.message});
//     }
// }

