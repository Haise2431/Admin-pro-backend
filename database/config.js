const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN);   

        console.log('DB Online desde env');
    } catch (error) {
        console.log(error);        
    }    
}

module.exports = {
    dbConnection
}