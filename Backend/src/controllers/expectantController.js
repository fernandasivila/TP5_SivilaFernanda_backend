const Expectant = require("../database/models/Expectant");

const expectantController = {
    list: async (req, res) => {
        try{
            const expectants = await Expectant.find();
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Expectants retrieved successfully'
                },
                "data": expectants
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
        const expectant = req.body;

        const errors = [];

        if(!expectant.surname)errors.push('Surname is required.');
        if (!expectant.name) errors.push('Name is required.');
        if (!expectant.dni) errors.push('DNI is required.');
        if (!expectant.email) errors.push('Email is required.');

        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }

        const newExpectant = new Expectant(expectant);
            try{
                await newExpectant.save();
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Expectant created successfully'
                    },
                    "data": newExpectant
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
    getById:async (req, res) => {
        const id = req.params.id;
        try{
            const expectant = await Expectant.findById(id);
            if(expectant){
                res.status(200).json({
                    "meta": {
                    "status": 200,
                    "message": 'Expectant found successfully'
                    },
                    "data": expectant
                });
            }
            else{
                res.status(200).json({
                    "meta": {
                    "status": 200,
                    "message": 'Expectant not found'
                    }
                });
            }
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
    }
}

module.exports = expectantController;