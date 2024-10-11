const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('./database.js');

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


app.set('port', 8001);

app.use('/salao', require('./src/routes/salao.routes.js'))

app.listen(app.get('port'), () => {
    console.log(`WS escutando na porta ${app.get('port')}`);
});



app.listen()