import Detail_transactions from "../models/Detail_transactionModel.js";
import Transaction from "../models/TransactionModel.js";
import Sesis from "../models/SesiModel.js";
import { Op } from "sequelize";

export const getDetailById = async(req, res) => {
    const {transactionId} = req.params;

    try {
        const detail = await Detail_transactions.findAll({
            where: {
                transactionId: transactionId
            }
            
        })
        if(!detail) return res.status(404).json({msg: "Data tidak ditemukan"});
        let response = await Detail_transactions.findAll({
                attributes:['jumlah'],
                where:{
                    transactionId: transactionId 
                },
                include:[{
                    model: Transaction,
                    attributes:['metode_pembayaran','harga_total', 'status']
                },{
                    model: Sesis,
                    attributes:['nama']
                }]
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// Sesi dulu baru Transaksi
export const createDetail = async(req, res) => {
    const {transactionId, sesisId} = req.params;

    const {jumlah} = req.body;
    try {
        await Detail_transactions.create({
            jumlah: jumlah,
            transactionId: transactionId,
            sesisId:sesisId
        });
        res.status(201).json({msg: "Detail Created Successfully"})
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateDetail = async(req, res) => {
    try {
        const detail = await Detail_transactions.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!detail) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {jumlah} = req.body;
        await Detail_transactions.update({
            jumlah
            },{
                where:{
                    id: detail.id  
                }
            });
        res.status(200).json({msg: "Detail Transaction Updated Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteDetail = async(req, res) => {
    try {
        const detail = await Detail_transactions.findOne({
            where: {
                id: req.params.id
            }
            
        })
        if(!detail) return res.status(404).json({msg: "Data tidak ditemukan"});
        await Detail_transactions.destroy({
                where:{
                    id: detail.id  
                }
        });
        res.status(200).json({msg: "Detail Transaction Deleted Successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

