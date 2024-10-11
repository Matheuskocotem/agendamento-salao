const express = require('express');
const app = express();
const morgan = require('morgan');
require('./database.js');

app.set('port', 8001);

app.listen(app.get('port'), () => {
    console.log(`WS escutando na porta ${app.get('port')}`);
});



app.listen()