import Transactions from "../models/TransactionModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getTransactions = async(req, res) => {
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
            response = await Transactions.findAll({
                attributes:['id', 'waktu', 'metode_pembayaran', 'harga_total', 'status'],
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

export const createTransaction = async(req, res) => {
    const {metode_pembayaran, harga_total, status} = req.body;
    try {
        await Transactions.create({
            metode_pembayaran: metode_pembayaran,
            harga_total: harga_total,
            status: status,
            userId: req.userId
        });
        res.status(201).json({msg: "Transaction Created Successfully"})
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
