import Transactions from "../models/TransactionModel.js";
import Users from "../models/UserModel.js";
import Sesis from "../models/SesiModel.js";
import Activities from "../models/ActivityModel.js";
import { MelocalException, StatusResponse } from "../utils/Response.js";
import { MelocalMail } from "../utils/SMTPEmail.js";
import { Role, StatusPembayaran, TypesImages } from "../constants/Constants.js";
import Images from "../models/ImageModel.js";

export const createTransaction = async (req, res) => {
  let { metode_pembayaran, harga_total, slot_dibeli, sesis_id } = req.body;
  const file = req.file;
  slot_dibeli = parseInt(slot_dibeli)
  try {
    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) return MelocalException(res, 400, "user tidak ditemukan", StatusResponse.ERROR, null)
    
    const sesis = await Sesis.findOne({
      where: {
        id: sesis_id,
      },
    });

    if (!sesis) return MelocalException(res, 400, "sesi tidak ditemukan", StatusResponse.ERROR, null)

    const count = sesis.slot_maks - sesis.slot_booked // 10 - 5 = 5 + 4 = 9
    if (count < slot_dibeli) return MelocalException(res, 400, "slot yang anda beli telah melewati batas", StatusResponse.ERROR, null)

    const transaction = await Transactions.create({
      metode_pembayaran: metode_pembayaran,
      harga_total: harga_total,
      userId: user.id,
      status: StatusPembayaran.MENUNGGU_VERIFIKASI,
      bukti_pembayaran: file ? file.filename : null,
      sesisId: sesis_id, 
      slot_dibeli: slot_dibeli,
    })

    if (!transaction) return MelocalException(res, 400, "transaksi gagal", StatusResponse.ERROR, null)

    await Sesis.update(
      {
        slot_booked: sesis.slot_booked + slot_dibeli,
      },
      {
        where: {
          id: sesis.id,
        },
      }
    );

    // send mail to mitra
    const activityAndMitra = await Activities.findOne({
      where: {
        id: sesis.activityId,
      },
      include: Users,
    });

    if (!activityAndMitra) return MelocalException(res, 400, "aktivitas tidak ditemukan", StatusResponse.ERROR, null)

    const data = {
      email: activityAndMitra.user.email,
      subject: "transaksi Berhasil",
      text: `transaksi anda berhasil, silahkan lakukan pembayaran sebesar ${transaction.harga_total} ke rekening 1234567890`,
    }

    const mailer = MelocalMail(req, res, data)
    if (!mailer) return MelocalException(res, 400, "email gagal dikirim", StatusResponse.ERROR, null)
    
    return MelocalException(res, 200, "transaksi berhasil", StatusResponse.SUCCESS, transaction)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
};

export const getTransactionsSesis = async (req, res) => {
  try {
    const sesis = await Sesis.findOne({
      where: {
        id: req.params.sesis_id,
      },
    });

    if (!sesis) return MelocalException(res, 404, "sesi tidak ditemukan", StatusResponse.ERROR, null)

    const transactions = await Transactions.findAll({
      where: {
        sesisId: sesis.id,
      },
    });

    if (!transactions) return MelocalException(res, 404, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil ditemukan", StatusResponse.SUCCESS, transactions)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
};

export const getTransactionByStatusPending = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      where: {
        status: StatusPembayaran.MENUNGGU_VERIFIKASI,
      },
      include: [
        Sesis,
      ]
    });

    if (!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    for (const data of transactions) {
      const activity = await Activities.findOne({
        where: {
          id: data.sesis.activityId,
        },
        include: [
          Images
        ]
      });

      data.setDataValue('activity', activity)
    }

    if (!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil ditemukan", StatusResponse.SUCCESS, transactions)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
}

export const getTransactionByStatusSuccess = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      where: {
        status: StatusPembayaran.TERVERIFIKASI,
      },
      include: [
        Sesis,
      ]
    });

    if (!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    for (const data of transactions) {
      const activity = await Activities.findOne({
        where: {
          id: data.sesis.activityId,
        },
        include: [
          Images
        ]
      });

      data.setDataValue('activity', activity)
    }

    if (!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil ditemukan", StatusResponse.SUCCESS, transactions)
  } catch(error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
}

export const getTransactionUser = async (req, res) => {
  try {
    const transactions = await Transactions.findAll({
      where: {
        userId: req.userId,
      },
      include: [
        Sesis,
      ]
    });

    if(!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    for (const data of transactions) {
      const activity = await Activities.findOne({
        where: {
          id: data.sesis.activityId,
        },
        include: [
          Images
        ]
      });

      data.setDataValue('activity', activity)
    }

    if (!transactions) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil ditemukan", StatusResponse.SUCCESS, transactions)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
}

export const getDetailTransaction = async (req, res) => {
  try {
    const transaction = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!transaction) return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil ditemukan", StatusResponse.SUCCESS, transaction)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
}

export const ExampleSendMail = async (req, res) => {
  const data = {
      email: user.email,
      subject: "Transaksi Berhasil",
      text: `Transaksi anda berhasil, silahkan lakukan pembayaran sebesar ${harga_total} ke rekening 1234567890`,
    }

    const mailer = MelocalMail(req, res, data)
    if (!mailer) return MelocalException(res, 400, "email gagal dikirim", StatusResponse.ERROR, null)

    return MelocalException(res, 200, "transaksi berhasil", StatusResponse.SUCCESS, data)
}

export const updateTransaction = async (req, res) => {
  const { status } = req.body;
  try {
    const transaction = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
      include: Sesis,
    });
    if (!transaction)
      return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)

    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!user) return MelocalException(res, 400, "user tidak ditemukan", StatusResponse.ERROR, null)

    const userTransaction = await Users.findOne({
      where: {
        id: transaction.userId,
      },
    });
    if (!userTransaction) return MelocalException(res, 400, "kreator user transaksi tidak ditemukan", StatusResponse.ERROR, null)

    if (user.role === Role.USER && transaction.status === StatusPembayaran.MENUNGGU_VERIFIKASI) {
      if (userTransaction.id !== user.id)
        return MelocalException(res, 401, "anda tidak memiliki akses", StatusResponse.ERROR, null)

      if (status === StatusPembayaran.BATAL) {
        await Transactions.update(
          {
            status: status,
          },
          {
            where: {
              id: transaction.id,
            },
          }
        );

        await Sesis.update(
          {
            slot_booked: transaction.sesis.slot_booked - transaction.slot_dibeli,
          },
          {
            where: {
              id: transaction.sesisId,
            },
          }
        );

        const response = {
          id: transaction.id,
          status: status,
        }

        return MelocalException(res, 200, "transaksi berhasil dibatalkan", StatusResponse.SUCCESS, response)
      }
    } else if (user.role === Role.MITRA) {
      if (status === StatusPembayaran.TERVERIFIKASI) {
        await Transactions.update(
          {
            status: status,
          },
          {
            where: {
              id: transaction.id,
            },
          }
        );

        const response = {
          id: transaction.id,
          status: status,
          bukti_pembayaran: transaction.bukti_pembayaran,
          slot_dibeli: transaction.slot_dibeli,
        }

        return MelocalException(res, 200, "transaksi berhasil terverifikasi", StatusResponse.SUCCESS, response)
      } else if (status === StatusPembayaran.BATAL) {
        await Transactions.update(
          {
            status: status,
          },
          {
            where: {
              id: transaction.id,
            },
          }
        );

        await Sesis.update(
          {
            slot_booked: transaction.sesis.slot_booked - transaction.slot_dibeli,
          },
          {
            where: {
              id: transaction.sesisId,
            },
          }
        );
          
        const response = {
          id: transaction.id,
          status: status,
        }

        return MelocalException(res, 200, "transaksi berhasil dibatalkan", StatusResponse.SUCCESS, response)
      }
    } 
    return MelocalException(res, 401, "anda tidak memiliki akses", StatusResponse.ERROR, null)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!transaction)
      return MelocalException(res, 400, "transaksi tidak ditemukan", StatusResponse.ERROR, null)
    await Transactions.destroy({
      where: {
        id: transaction.id,
      },
    });

    return MelocalException(res, 200, "transaksi berhasil dihapus", StatusResponse.SUCCESS, null)
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
};
