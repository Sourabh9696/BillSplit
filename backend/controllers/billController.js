const db = require('../models')
const { Op } = require('sequelize');

// create main Model
const User = db.users
const Bill = db.bills
const BillUser = db.billusers


//Add Bill into Bill table and BillUser table
const createBill = async (req, res) => {

    let Billinfo = {
        name: req.body.expenseName,
        description: req.body.expenseDescription,
        category: req.body.expenseCategory,
        amount: req.body.expenseAmount,
        userId: req.body.expenseOwnerId
    }

    await Bill.create(Billinfo).then(function (result) {
        if (result) {
            req.body.expenseMembers.forEach((element) => {
                let BillUserinfo = {
                    userId: element.id,
                    billId: result.id,
                    amount: element.amount

                }
                BillUser.create(BillUserinfo).then(function (result) { })
            });
            var senddata = {
                "status": "VALID", "message": "Record Inserted",
                "requestedData": [req.body], "responseData": [result]
            }
            return res.status(200).send(senddata)
        } else {
            var senddata = {
                "status": "INVALID", "message": "Record Inserted Error",
                "requestedData": [req.body], "responseData": [result]
            }
            return res.status(400).send(senddata)
        }
    }).catch(function (err) {
        var senddata = {
            "status": "INVALID", "message": err,
            "requestedData": [req.body], "responseData": []
        }
        return res.status(400).send(senddata)
    });

}

//Get All Bills

const getAllBills = async(req,res) => {
    await Bill.findAll().then(function (result) {
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


//get list of users contribution done on a bill
const getBillContribution = async(req,res) => {
    //get Bill Id
    let id = req.params.id;
    await User.findAll({include: [{
        model: BillUser,
        where: {billId: id}
       }]}).then(function (result) {
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

module.exports = {
    createBill,
    getAllBills,
    getBillContribution

}