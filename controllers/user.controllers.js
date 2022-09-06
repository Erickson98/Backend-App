const User = require("../models/User");

const getUser = async (req, res) => {
  let element = await User.findAll({
    attributes: ["_id", "Name", "Identificator", "Rol"],
  });
  res.status(200).json({
    success: true,
    message: "successfull",
    Users: element,
  });
};

const updateUser = async (req, res) => {
  let element = await User.update(
    {
      Rol: req.params.rol,
    },
    {
      where: {
        _id: req.params._id,
      },
    }
  );
  return res.json(element);
};

const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { _id: req.params._id } });
    res.status(200).json({
      success: true,
      message: "successfull delete",
    });
  } catch (error) {
    res.send();
  }
};
module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
