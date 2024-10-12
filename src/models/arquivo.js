const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arquivo = new Schema({
    referenciaId:{
        type: Screma.Types.ObjectId,
        refPath: 'model'
    },
    model: {
        type: String, 
        required: true,
        enun: ['Servico', 'Salao']
    },
    caminho: {
        type: String,
        required: true,
    },
    datacadrastro: {
        type: Data,
        default:Date.now
    },
});


module.exports = mongoose.model('Arquivo', arquivo);