const Expectant = require('../database/models/Expectant');
const Ticket = require('../database/models/Ticket');

const ticketController = {
    add: async(req, res) => {
        const ticket = req.body;
        console.log(ticket);
        const errors = [];

        if(typeof ticket.price !== 'number') errors.push('Price is required and must be a number'); 
        if(!ticket.categoryExpectant) errors.push('CategoryExpectant is required.');
        if(ticket.categoryExpectant !== 'E' && ticket.categoryExpectant !== 'L') errors.push('CategoryExpectant must have a valid format: L(Local) or E(Extranjero)');
        if (!ticket.purchaseDate) errors.push('PurchaseDate is required.');
        if(!isValidDateFormat(ticket.purchaseDate)) errors.push('PuschaseDate must have a valid date and format: dd/mm/yyyy');
        if(!ticket.expectant.surname) errors.push('Expectant surname is required.');
        if(!ticket.expectant.name) errors.push('Expectant name  is required.');
        if(!ticket.expectant.dni) errors.push('Expectant dni is required.');
        if(!ticket.expectant.email) errors.push('Expectant email is required.'); 

        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }

        const expectant = await Expectant.findOne({surname: ticket.expectant.surname, name: ticket.expectant.name, dni: ticket.expectant.dni, email: ticket.expectant.email});
        try{
            let idExpectant = expectant?._id || 0;
            if(!expectant){
                const newExpectant = new Expectant(ticket.expectant);
                await newExpectant.save();
                idExpectant = newExpectant._id;
            }
            const newTicket = new Ticket({
                ...ticket,
                expectant: idExpectant
            });
            await newTicket.save();
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Ticket created successfully'
                    },
                    "data": newTicket
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
    list: async(req, res) => {
        try{
            const tickets = await Ticket.find().populate('expectant');
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Tickets retrieved successfully'
                },
                "data": tickets,
                "amount": tickets.length
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
    delete: async(req, res) => {
        const id = req.params.id;
        try{
            await Ticket.deleteOne({_id:id});
            res.json({
                "meta": {
                "status": 200,
                "message": 'Ticket deleted successfully'
                },
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
    update: async(req, res) => {
        const id = req.params.id;
        let updatedTicket = req.body;
        const errors = [];

        if(updatedTicket.price && typeof updatedTicket.price !== 'number') errors.push('Price must be a number');
        if(updatedTicket.categoryExpectant && updatedTicket.categoryExpectant !== 'E' && updatedTicket.categoryExpectant !== 'L') errors.push('CategoryExpectant must have a valid format: L(Local) or E(Extranjero)');
        if(updatedTicket.purchaseDate && !isValidDateFormat(updatedTicket.purchaseDate)) errors.push('PuschaseDate must have a valid date and format: dd/mm/yyyy');
        if(updatedTicket.expectant?.surname && typeof updatedTicket.expectant.surname !== 'string' ) errors.push('Expectant surname is a string.');
        if(updatedTicket.expectant?.name && typeof updatedTicket.expectant.name !== 'string' ) errors.push('Expectant name  is a string.');
        if(updatedTicket.expectant?.dni && typeof updatedTicket.expectant.dni !== 'string' ) errors.push('Expectant dni is a string.');
        if(updatedTicket.expectant?.email && typeof updatedTicket.expectant.email !== 'string' ) errors.push('Expectant email is a string.'); 

        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }

        const ticket = await Ticket.findById(id);
        if(ticket){
            const idExpectant = ticket.expectant;
            if(updatedTicket.expectant){
                await Expectant.updateOne({_id:idExpectant}, updatedTicket.expectant);
            }
        try{
                updatedTicket = {
                    ...updatedTicket,
                    expectant: idExpectant
                }
                await Ticket.updateOne({_id:id}, updatedTicket);
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Ticket updated successfully'
                    },
                    "data": updatedTicket
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
        }}
        else{
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Ticket not found'
                }
            });
        }   
    },
    getByCategory: async(req, res) => {
        const categoryExpectant = req.params.category;
        try{
            const ticketsByCategory = await Ticket.find({categoryExpectant: categoryExpectant}).populate('expectant');

            if(ticketsByCategory.length > 0){
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `Tickets with category:${categoryExpectant == 'E'? 'Extrajero' : 'Local'} retrieved successfully`
                    },
                    "data": ticketsByCategory,
                    "amount": ticketsByCategory.length
                });
            }
            else{
                res.json({
                    "meta": {
                    "status": 200,
                    "message": `There are not tickets with category:${categoryExpectant == 'E'? 'Extrajero' : 'Local'}`,
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
    getById: async(req, res) => {
        const id = req.params.id;
        try{
            const ticket = await Ticket.findById(id).populate('expectant');
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Ticket found successfully'
                },
                "data": ticket
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
    }
}

function isValidDateFormat(dateString) {
  
    if(dateString){
    const parts = dateString.split('/');
  
    if (parts.length !== 3) {
      return false;
    }
  
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
  
    const date = new Date(year, month - 1, day); // month - 1 porque en JavaScript los meses van de 0 a 11
  
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
}
}

module.exports = ticketController;