const billController = require('../controllers/billController.js')
const router = require('express').Router()

router.post('/addExpense', billController.createBill);
router.get('/allBills', billController.getAllBills)
router.get('/billContribution/:id', billController.getBillContribution)

module.exports = router