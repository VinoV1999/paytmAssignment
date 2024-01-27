// backend/routes/account.js
const express = require('express');
const { authMiddleWare } = require('../middlewares/authMiddleWare');
const { Account } = require('../mongoose');
const { Mongoose } = require('mongoose');

const router = express.Router();

router.get('/balance', authMiddleWare, async(req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    });
    return res.status(200).json({
        balance: account.balance
    })
})

router.post('/transfer', authMiddleWare, async(req, res)=>{
    const session = await Mongoose.startSession();
    
    session.startTransaction();
    const { to, amount } = req.body;

    const fromAccount = await Account.findOne({
        userId:req.userId
    }).session(session);
    
    if(!fromAccount || fromAccount.balance < amount){
        await session.abortTransaction();
        return res.status(411).json({
            message:'Insufficient Balance'
        })
    } 

    const toAccount = await Account.findOne({
        userId:to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(411).json({
            message:'Invalid Receiver Address'
        })
    } 

    await Account.updateOne({userId:req.userId}, {$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userid:to}, {$inc: amount}).session(session);

    await session.commitTransaction();
    return res.status(200).json({
        message: "Transfer successful"
    });
})

module.exports = router;
