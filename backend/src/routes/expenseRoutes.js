const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, getSummary, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/summary', getSummary);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
