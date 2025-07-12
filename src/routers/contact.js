const express = require('express');
const contactController = require('../controllers/contact');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Apply authenticate middleware to all contact routes
router.use(authenticate);

// GET /contacts
router.get('/', contactController.getAllContacts);

// GET /contacts/:contactId
router.get('/:contactId', contactController.getContactById);

// POST /contacts
router.post('/', contactController.createContact);

// PUT /contacts/:contactId
router.put('/:contactId', contactController.updateContact);

// DELETE /contacts/:contactId
router.delete('/:contactId', contactController.deleteContact);

module.exports = router; 