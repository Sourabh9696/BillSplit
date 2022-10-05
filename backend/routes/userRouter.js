const userController = require('../controllers/userController.js')
const router = require('express').Router()

router.post('/createUser', userController.createUser)
router.get('/allUsers', userController.getAllUser)
router.get('/userExpenses/:id', userController.getUserExpenses)
router.get('/userBalance/:id', userController.getUserBalance)

module.exports = router