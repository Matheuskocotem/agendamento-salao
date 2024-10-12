const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');

router.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const novoSalao = new Salao(req.body);
        const salaoSalvo = await novoSalao.save();
        res.status(201).json(salaoSalvo);
    } catch (error) {
        console.error('Erro ao criar salão:', error);
        res.status(500).json({ error: 'Erro ao criar salão' });
    }
});


module.exports = router;