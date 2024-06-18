const Product = require("../database/models/Product");
const path = require('path');
const fs = require('fs');

const productController = {
    list: async (req, res) => {
        try{
            let products = await Product.find();
            const productsWithImage = await Promise.all(
                products.map( async product => {
                    const nameImage = product.image;
                    return {
                            ...product.toObject(),
                            image: `${req.protocol}://${req.get('host')}/products/image/${nameImage}`
                    }
                })
            );
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Products retrieved successfully'
                },
                "data": productsWithImage
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
        let product = req.body;
        console.log(req.file);
        const errors = [];

        if(!product.name)errors.push('Name is required.');
        if (!product.description) errors.push('Description is required.');
        if(!req.file) errors.push('Image is required.');
        if (typeof +product.price !== 'number') errors.push('Price must be a number.');
        if (typeof +product.stock !== 'number') errors.push('Stock must be a number.');
        if (typeof stringToBoolean(product.outstanding) !== 'boolean') errors.push('Outstanding must be a boolean.');

        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }

        
        product = {
            ...product,
            image: req.file.filename
        }
        let newProduct = new Product(product);
            try{
                await newProduct.save();
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Product created successfully'
                    },
                    "data": newProduct
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
    delete: async(req, res) => {
        const id = req.params.id;
        try{
            await Product.deleteOne({_id:id});
            res.json({
                "meta": {
                "status": 200,
                "message": 'Product deleted successfully'
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
        const updatedProduct = req.body;
        const errors = [];

        if (updatedProduct.price && typeof updatedProduct.price !== 'number') errors.push('Price must be a number.');
        if (updatedProduct.stock && typeof updatedProduct.stock !== 'number') errors.push('Stock must be a number.');
        if (updatedProduct.outstanding && typeof updatedProduct.outstanding !== 'boolean') errors.push('Outstanding must be a boolean.');

        if (errors.length > 0) {
            return res.status(400).json({
              meta: {
                status: 400,
                message: 'Bad Request',
                errors: errors
              }
            });
        }

        try{
                await Product.updateOne({_id:id}, updatedProduct);
                res.json({
                    "meta": {
                    "status": 200,
                    "message": 'Product updated successfully'
                    },
                    "data": updatedProduct
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
    getOutstanding: async(req, res) => {
        try{
            const productsOutstanding = await Product.find({outstanding: true});
            const productsOutstandingWithImage = await Promise.all(
                productsOutstanding.map( async product => {
                    const nameImage = product.image;
                    return {
                            ...product.toObject(),
                            image: `${req.protocol}://${req.get('host')}/products/image/${nameImage}`
                    }
                })
            );
            res.status(200).json({
                "meta": {
                "status": 200,
                "message": 'Products outstanding retrieved successfully'
                },
                "data": productsOutstandingWithImage
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
    getImage: async(req,res) => {
        const imageName = req.params.image;
        const pathImage = path.resolve(__dirname, `../../public/images/${imageName}`);
        console.log(pathImage);
        if(fs.existsSync(pathImage)){
            res.sendFile(pathImage);
        }else{
            const pathNotImage = path.resolve(__dirname, `../../public/images/default.jpg`);
            res.sendFile(pathNotImage);
        }
    }
}

const stringToBoolean = (str) => {
    return ['true'].includes(str.toLowerCase());
  }

module.exports = productController;