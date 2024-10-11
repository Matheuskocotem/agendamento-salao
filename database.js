const mongoose = require('mongoose');
const URI = 'mongodb+srv://salaoUser:brIBzx32MiodJOD3@cluster0.lky72.mongodb.net/salaoUser?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(URI)
    .then(() => console.log('Db is Up!'))
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err.message); // Log detalhado do erro
    });
