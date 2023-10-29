import Images from "../models/ImageModel.js";
import Activities from "../models/ActivityModel.js";
import { Op } from "sequelize";

export const getImage = async (req, res) => {
  try {
    let response = await Images.findAll({
      attributes: ["nama", "url"],
      where: {
        activityId: req.activityId,
      },
      include: [
        {
          model: Activities,
          attributes: ["nama"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getImageById = async (req, res) => {
  const { activityId } = req.params;

  try {
    const image = await Images.findAll({
      where: {
        activityId: activityId,
      },
    });
    if (!image) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response = await Images.findAll({
      attributes: ["nama", "url"],
      where: {
        activityId: activityId,
      },
      include: [
        {
          model: Activities,
          attributes: ["nama"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createImage = async (req, res) => {
  const { activityId } = req.params;
  const { nama, url } = req.body;
  const file = req.file.path;
  console.log(file);
  if (!file) {
    res.status(400).send({
      status: false,
      data: "No File is selected.",
    });
  }

  try {
    console.log(process.env.BASE_URL + file);
    await Images.create({
      nama: nama,
      url: `${process.env.BASE_URL}/${file}`,
      activityId: activityId,
    });
    res.status(201).json({ msg: "Image Created Successfully", file: file });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateImage = async (req, res) => {
  try {
    const image = await Images.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!image) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { nama, url } = req.body;
    await Images.update(
      {
        nama,
        url,
      },
      {
        where: {
          id: image.id,
        },
      }
    );
    res.status(200).json({ msg: "Image Updated Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Images.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!image) return res.status(404).json({ msg: "Data tidak ditemukan" });
    await Images.destroy({
      where: {
        id: image.id,
      },
    });
    res.status(200).json({ msg: "Image Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
