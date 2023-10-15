import Transactions from "../models/TransactionModel.js";
import Users from "../models/UserModel.js";
import Sesis from "../models/SesiModel.js";
import { Op, Sequelize } from "sequelize";
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
import { google } from "googleapis";


export const getTransactions = async(req, res) => {
    const {userId} = req.params;
    try {
        let response;
        if(req.role === "admin"){
            response = await Transactions.findAll({
                attributes:['id', 'waktu', 'metode_pembayaran', 'harga_total', 'status'],
                include:[{
                    model: Users, 
                    attributes:['nama','email']
                }]
            });
        } else {
            // response = await Transactions.findAll({
            //     attributes:['id', 'waktu', 'metode_pembayaran', 'harga_total', 'status'],
            //     where:{
            //         userId: userId
            //     },
            //     include:[{
            //         model: Users,
            //         attributes:['nama','email']
            //     }]
            // });
            const sequelize = new Sequelize('melocaldb', 'root', '', {
                host: "localhost",
                dialect: "mysql"
            });

            const query = `
                SELECT transactions.id, transactions.waktu, transactions.metode_pembayaran, transactions.harga_total,
                transactions.status, transactions.slot_dibeli, sesis.nama AS sesi_nama, sesis.tanggal, sesis.slot_booked,
                activities.nama, activities.harga, activities.lokasi FROM transactions JOIN sesis
                ON transactions.sesisId = sesis.id JOIN activities ON sesis.activityId = activities.id
                WHERE transactions.userId = ${userId}
            `;

            response = await sequelize.query(query, {
                replacements: { userId }, // Pass userId as a replacement to prevent SQL injection
                type: Sequelize.QueryTypes.SELECT // Specify the query type
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getTransactionById = async(req, res) => {
    try {
        const transaction = await Transactions.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response;
        if(req.role === "admin"){
            response = await Transactions.findOne({
                attributes:['id', 'waktu', 'metode_pembayaran', 'harga_total', 'status'],
                where: {
                    id: transaction.id
                },
                include:[{
                    model: Users, 
                    attributes:['nama','email']
                }]
            });
        } else {
            response = await Transactions.findOne({
                attributes:['id', 'waktu', 'metode_pembayaran', 'harga_total', 'status'],
                where:{
                    [Op.and]:[{id: transaction.id}, {userId: req.userId}]   
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

export const getPendingTransactions = async(req, res) => {
    const { userId } = req.params;
    try {
        const sequelize = new Sequelize('melocaldb', 'root', '', {
            host: "localhost",
            dialect: "mysql"
        });

        const query = `
            SELECT transactions.id AS id_tr, transactions.waktu, transactions.status, transactions.slot_dibeli, sesis.id AS id_sesi,
            sesis.nama AS nama_sesi, sesis.tanggal AS tanggal_sesi, sesis.slot_maks, sesis.slot_booked, activities.nama,
            activities.harga, activities.lokasi FROM transactions JOIN sesis ON
            transactions.sesisId = sesis.id JOIN activities ON sesis.activityId = activities.id
            WHERE transactions.status LIKE 'menunggu verifikasi' AND activities.userId = ${userId}
        `;

        let response = await sequelize.query(query, {
            replacements: { userId }, // Pass userId as a replacement to prevent SQL injection
            type: Sequelize.QueryTypes.SELECT // Specify the query type
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createTransaction = async(req, res) => {
    const {metode_pembayaran, harga_total, slot_dibeli, sesisId} = req.body;
    const { userId } = req.params;
    console.log(req.body);
    try {
        const transaction = await Transactions.create({
            metode_pembayaran: metode_pembayaran,
            harga_total: harga_total,
            status: 'menunggu verifikasi',
            userId: userId
        });
        if (transaction) {
            // const OAuth2 = google.auth.OAuth2;
            const user = await Users.findByPk(userId)

            let transporter = nodemailer.createTransport({
                service: "gmail",
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                });
                let mailOptions = {
                    from: 'Melocal <melocal@gmail.com>',
                    to: 'ferzanoveri@gmail.com',
                    subject: 'Nodemailer Project',
                    text: 'Hi from your nodemailer project'
                  };

                  transporter.sendMail(mailOptions, function(err, data) {
                    if (err) {
                      console.log("Error " + err);
                    } else {
                      console.log("Email sent successfully");
                    }
                  });
                  
        //     const message = { 
        //         messaging_product: "whatsapp", 
        //         to: "6281314262109", 
        //         type: "template", 
        //         template: { 
        //             name: "hello_world", 
        //             language: { 
        //                 code: "en_US" 
        //             } 
        //         } }
        //     fetch('https://graph.facebook.com/v17.0/112473161958400/messages', {
        //         method: 'POST',
        //         body: JSON.stringify(message),
        //         headers: { 
        //             'Content-Type': 'application/json',
        //             Authorization: 'Bearer EAAIZBFmaltikBO8nj8UoWAve21DBWzahUcKfSPk7MYprU1PjNZAZC3EzSw9PFy0Nt0hWCrcI3T9nStv43WYgIKqXgU6KpxambIK6L3elxeSmSl687I6Fe7hJCN0sDx1zRNvgQ01xmvHz4Nbvqluoa2vqMj586VA1KxUhbOZBSKgXGhta5ymBOFI9RZCUPTZAtuLCknBO54DhoRGAF7' 
        //         }
        //     })
        //     .then(res => res.json())
        //     .then(json => console.log(json));
        }
        res.status(201).json({msg: "Transaction Created Successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message});
    }
}

export const updateVerifyTransaction = async(req, res) => {
    const { id } = req.params;
    try {
        await Transactions.update({
            status: 'terverifikasi'
        },{
            where:{
                id: id
            }
        });
        res.status(200).json({msg: "Transaction Updated Successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateTransaction = async(req, res) => {
    try {
        const transaction = await Transactions.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {metode_pembayaran, harga_total, status} = req.body;
        if(req.role === "admin"){
            await Activities.update({
                metode_pembayaran, harga_total, status
            },{
                where:{
                    id: transaction.id
                }
            });
        } else {
            if(req.userId !== transaction.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Transactions.update({
                metode_pembayaran, harga_total, status
            },{
                where:{
                    [Op.and]:[{id: transaction.id}, {userId: req.userId}]   
                }
            });
        }
        res.status(200).json({msg: "Product Updated Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateDenyTransaction = async(req, res) => {
    const { id } = req.params;
    try {
        await Transactions.update({
            status: 'batal'
        },{
            where:{
                id: id
            }
        });
        res.status(200).json({msg: "Transaction Updated Successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteTransaction = async(req, res) => {
    try {
        const transaction = await Transactions.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!transaction) return res.status(404).json({msg: "Data tidak ditemukan"});
        if(req.role === "admin"){
            await transaction.destroy({
                where:{
                    id: transaction.id
                }
            });
        } else {
            if(req.userId !== transaction.userId) return res.status(403).json({msg: "Akses terlarang"});
            await Transactions.destroy({
                where:{
                    [Op.and]:[{id: transaction.id}, {userId: req.userId}]   
                }
            });
        }
        res.status(200).json({msg: "Product Deleted Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}
