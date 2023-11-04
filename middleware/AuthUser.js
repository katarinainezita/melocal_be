'use strict';

import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { MelocalException, StatusResponse } from '../utils/Response.js';

export const verifyUser = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Mohon login ke akun Anda!' });
  }
  const user = await Users.findOne({
    where: {
      id: req.userId,
    },
  });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      id: req.userId,
    },
  });
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  if (user.role !== 'admin') return res.status(403).json({ message: 'Akses terlarang' });
  next();
};

export const generateToken = async (user) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return token;
  } catch (error) {
    return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
  }
};

export const verifyTokenForMitra = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return MelocalException(res, 401, 'Token not found', StatusResponse.ERROR, null)
        }
        
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return MelocalException(res, 401, 'invalid token', StatusResponse.ERROR, null)
        }
      
        const data = { ...decoded }
        const mitra = await Users.findOne({
          where: {
            id: data.id,
          },
        });

        if (!mitra) return MelocalException(res, 404, 'mitra tidak ditemukan', StatusResponse.ERROR, null)
        if (mitra.role !== 'mitra') return MelocalException(res, 403, 'akses terlarang', StatusResponse.ERROR, null)
        
        req.userId = data.id;
        req.role = data.role;
      
        next();
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
};

export const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return MelocalException(res, 401, 'Token not found!', StatusResponse.ERROR, null)
        }
        
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return MelocalException(res, 401, 'invalid token', StatusResponse.ERROR, null)
        }
      
        const user = { ...decoded }
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        return MelocalException(res, 500, error.message, StatusResponse.ERROR, null)
    }
}