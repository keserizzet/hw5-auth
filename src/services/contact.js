const createHttpError = require('create-http-error');
const Contact = require('../models/Contact');

const getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId }).sort({ createdAt: -1 });
  return contacts;
};

const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

const createContact = async (contactData, userId) => {
  const contact = new Contact({
    ...contactData,
    userId
  });
  
  await contact.save();
  return contact;
};

const updateContact = async (contactId, updateData, userId) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  return contact;
};

const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  
  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
}; 