const Person = require("../models/Person.js"); //

const createPerson = (req, res) => {
  try {
    const { Name, LastName, Date, Id, Address } = req.body;

    Person.create({
      Name: Name,
      LastName: LastName,
      Date: Date,
      Id: Id,
      Address: Address,
    });
    return res.send(req.body);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getPerson = async (req, res) => {
  try {
    const elements = await Person.findAll();
    res.json(elements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updatePerson = async (req, res) => {
  try {
    const { _id } = req.params;
    const { Name, LastName, Date, Id, Address } = req.body;
    const element = await Person.findByPk(_id);
    element.Name = Name;
    element.LastName = LastName;
    element.Date = Date;
    element.Id = Id;
    element.Address = Address;
    await element.save();
    return res.json(element);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deletePerson = async (req, res) => {
  try {
    const { _id } = req.params;
    await Person.destroy({
      where: {
        _id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPerson,
  getPerson,
  updatePerson,
  deletePerson,
};
