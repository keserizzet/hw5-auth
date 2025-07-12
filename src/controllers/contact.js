const createHttpError = require('create-http-error');
const contactService = require('../services/contact');

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getAllContacts(req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactService.getContactById(contactId, req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      throw createHttpError(400, 'Name, email and phone are required');
    }

    const contact = await contactService.createContact({ name, email, phone }, req.user._id);
    
    res.status(201).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateData = req.body;

    const contact = await contactService.updateContact(contactId, updateData, req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    
    await contactService.deleteContact(contactId, req.user._id);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 