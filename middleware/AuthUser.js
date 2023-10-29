'use strict';

import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const verifyUser = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Mohon login ke akun Anda!' });
  }
  const user = await Users.findOne({
    where: {
      id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    where: {
      id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
  if (user.role !== 'admin') return res.status(403).json({ msg: 'Akses terlarang' });
  next();
};

export const generateToken = async (req, res, next) => {
  try {
    const token = jwt.sign(
      {
        id: req.userId,
        role: req.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      }
    );

    req.token = token;
    return req.token;
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
      
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
