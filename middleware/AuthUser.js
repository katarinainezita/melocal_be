'use strict';

import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

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
    return res.status(500).json({ message: error.message });
  }
};


export const verifyTokenForAdmin = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return res.status(401).json({ message: 'Token not found!' });
        }
        
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
      
        const data = { ...decoded }
        const admin = await Users.findOne({
          where: {
            id: data.id,
          },
        });

        if (!admin) return res.status(404).json({ message: 'User tidak ditemukan' });
        if (admin.role !== 'admin') return res.status(403).json({ message: 'Akses terlarang' });
        
        req.userId = data.id;
        req.role = data.role;
      
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
};

export const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        if (!authorization) {
            return res.status(401).json({ message: 'Token not found!' });
        }
        
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
      
        const user = { ...decoded }
        req.userId = user.id;
        req.role = user.role;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message});
    }
}