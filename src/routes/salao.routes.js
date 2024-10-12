const express = require('express');
const router = express.Router();
const Salao = require('../models/salao');
const Servico = require('../models/servico');

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

router.get('/servicos/:salaoId', async (req, res) => {
    console.log(req.body);
    try {
        const { salaoId } = req.params;  
        const servico = await Servico.find({
            salaoId,
            status: 'A'
        }).select('_id titulo');

        res.json({
            servicos: servicos.map(s => ({ label: s.titulo, value: s._id })),
        });

    } catch (error) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;