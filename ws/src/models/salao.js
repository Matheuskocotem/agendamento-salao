const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salao = new Schema({
  nome: String,
  foto: String,
  capa: String,
  email: String,
  senha: String,
  telefone: String,
  recipientId: String,
  endereco: {
    cidade: String,
    uf: String,
    cep: String,
    logradouro: String,
    numero: String,
    pais: String,
  },
  geo: {
    type: { type: String, enum: ['Point'], required: true }, 
    coordinates: { type: [Number], required: true }, 
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

salao.index({ geo: '2dsphere' });

module.exports = mongoose.model('Salao', salao);
