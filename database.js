const mongoose = require('mongoose');
const URI = 'mongodb+srv://salaoUser:brIBzx32MiodJOD3@cluster0.lky72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(URI)
    .then(() => console.log('Db is Up!'))
    .catch((err) => console.log('Error:', err));
