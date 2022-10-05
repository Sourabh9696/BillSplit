const db = require('../models')
const { Op } = require('sequelize');

// create main Model
const User = db.users
const Bill = db.bills
const BillUser = db.billusers


//Add Individal User
const createUser = async (req, res) => {

    let Userinfo = {
        fullName: req.body.fullName,
        email: req.body.email,
        contact: req.body.contact,
        status: req.body.status ? req.body.inactive : true
    }

    await User.create(Userinfo).then(function (result) {
        if (result) {
            var senddata = {
                "status": "VALID", "message": "Record Inserted",
                "requestedData": [req.body], "responseData": [result]
            }
            return res.status(200).send(senddata)
        } else {
            var senddata = {
                "status": "INVALID", "message": "Record Inserted Error",
                "requestedData": [req.body], "responseData": [rsult]
            }
            return res.status(400).send(senddata)
        }
    }).catch(function (err) {
        var senddata = {
            "status": "VALID", "message": err,
            "requestedData": [req.body], "responseData": []
        }
        return res.status(400).send(senddata)
    });

}


//Get all the List of the Users
const getAllUser = async (req, res) => {
    await User.findAll().then(function (result) {
        if (result) {
            var senddata = {
                "status": "VALID", "message": "Records retrived successfully",
                "requestedData": [], "responseData": result
            }
            return res.status(200).send(senddata)
        } else {
            var senddata = {
                "status": "INVALID", "message": "No Recods found",
                "requestedData": [], "responseData": []
            }
            return res.status(400).send(senddata)
        }

    }).catch(function (err) {
        var senddata = {
            "status": "INVALID", "message": err,
            "requestedData": [], "responseData": []
        }
        return res.status(400).send(senddata)
    });
}


//Get List Of User Expenses
const getUserExpenses = async (req, res) => {
    let id = req.params.id;
    await Bill.findAll({ include: [{ model: BillUser, where: { userId: id } }] }).then(function (result) {
        if (result) {
            var senddata = {
                "status": "VALID", "message": "Records retrived successfully",
                "requestedData": [], "responseData": result
            }
            return res.status(200).send(senddata)
        } else {
            var senddata = {
                "status": "INVALID", "message": "No Recods found",
                "requestedData": [], "responseData": []
            }
            return res.status(400).send(senddata)
        }

    }).catch(function (err) {
        var senddata = {
            "status": "INVALID", "message": err,
            "requestedData": [], "responseData": []
        }
        return res.status(400).send(senddata)
    })

}

const getUserBalance = async (req, res) => {
    let id = req.params.id;
    let allUsersList = await User.findAll({ where: { id: { [Op.ne]: id } } }).then(function (result) { return result });
    let UserList = [];
    for (let i = 0; i <= allUsersList.length - 1; i++) {
        let CurrentDebtor = allUsersList[i];
        let AmountPaidByCurrentUser = 0;
        let CurrentUserPaidBills = await Bill.findAll({ where: { userId: id } }).then(function (result) { return result });

        if (CurrentUserPaidBills.length > 0) {
            for (let j = 0; j <= CurrentUserPaidBills.length - 1; j++) {
                let BillPaidByCurrentUser = await BillUser.findOne({ where: { billId: CurrentUserPaidBills[j].id, userId: CurrentDebtor.id } }).then(function (result) { return result });
                if (BillPaidByCurrentUser) {
                    AmountPaidByCurrentUser = (Number(AmountPaidByCurrentUser) + Number(BillPaidByCurrentUser.amount)).toFixed(2);
                }
            }
        }

        let AmountPaidByDebtor = 0;
        let DebtorPaidBills = await Bill.findAll({ where: { userId: CurrentDebtor.id } }).then(function (result) { return result });
        if (DebtorPaidBills.length > 0) {
            for (let j = 0; j <= DebtorPaidBills.length - 1; j++) {
                let BillPaidByDebtorUser = await BillUser.findOne({ where: { billId: DebtorPaidBills[j].id, userId: id } }).then(function (result) { return result });
                if (BillPaidByDebtorUser) {
                    AmountPaidByDebtor = (Number(AmountPaidByDebtor) + Number(BillPaidByDebtorUser.amount)).toFixed(2);
                }
            }
        }
        let oweAmount = (AmountPaidByCurrentUser - AmountPaidByDebtor).toFixed(2)
        if (oweAmount < 0) { oweAmount = Number(0.00);}
        let details = {"fullName": CurrentDebtor.fullName,"email": CurrentDebtor.email,"contact": CurrentDebtor.contact,"oweAmount": oweAmount}
        UserList.push(details)
    }
    var senddata = {
        "status": "VALID", "message": "Records retrived successfully",
        "requestedData": [], "responseData": UserList
    }
    return res.status(200).send(senddata);
}

module.exports = {
    createUser,
    getAllUser,
    getUserExpenses,
    getUserBalance

}