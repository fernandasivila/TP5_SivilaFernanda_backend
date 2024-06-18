const Transaction = require("../database/models/Transaction");

const transactionController = {
    list: async (req, res) => {
        try{
            const transactions = await Transaction.find();
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Transactions retrieved successfully'
                },
                "data": transactions
            });
        } catch (error) {
            res.status(500).json({
            meta: {
                status: 500,
                message: 'Internal Server Error'
            },
            data: {
                error: error.message
            }
            });
        }
    },
    add: async(req, res) => {
        const transaction = req.body;
        console.log("BODYYY:", req.body);

        const errors = [];

        if(!transaction.originCoin)errors.push('OriginCoin is required.');
        if (typeof +transaction.originAmount !== 'number') errors.push('OriginAmount is required and must be a number.');
        if (!transaction.destinationCoin) errors.push('DestinationCoin is required.');
        if (typeof +transaction.destinationAmount !== 'number') errors.push('DestinationAmount is required and must be a number.');
        if (!transaction.emailClient) errors.push('EmailClient is required.');
        if (typeof +transaction.conversionRate !== 'number') errors.push('ConversionRate is required and must be a number.');
        
        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }
        const newTransaction = new Transaction(transaction);
            try{
                await newTransaction.save();
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Transaction created successfully'
                    },
                    "data": newTransaction
                });
            
            } catch (error) {
                res.status(500).json({
                meta: {
                    status: 500,
                    message: 'Error processing operation'
                },
                data: {
                    error: error.message
                }
                });
            }
        
    },
    getByEmail: async(req, res) => {
        const emailClient = req.params.emailClient;
        try{
            const transactionsClient = await Transaction.find({emailClient: emailClient});

            if(transactionsClient.length > 0){
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `Transactions of client with email:${emailClient} retrieved successfully`
                    },
                    "data": transactionsClient
                });
            }
            else{
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `Client with email:${emailClient} does not have transactions`
                    },
                });
            }
        } catch (error) {
            res.status(500).json({
            meta: {
                status: 500,
                message: 'Error processing operation'
            },
            data: {
                error: error.message
            }
            });
        }
    },
    getByCoin: async(req, res) => {
        const coin = req.params.coin;
        try{
            const transactionsByCoin = await Transaction.find({$or: [{originCoin: coin}, {destinationCoin: coin}]});

            if(transactionsByCoin.length > 0){
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `Transactions with coin:${coin} retrieved successfully`
                    },
                    "data": transactionsByCoin
                });
            }
            else{
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `There are not transactions with coin: ${coin}`
                    }
                });
            }
            } catch (error) {
                res.status(500).json({
                meta: {
                    status: 500,
                    message: 'Error processing operation'
                },
                data: {
                    error: error.message
                }
                });
        }    
    }
}

module.exports = transactionController;