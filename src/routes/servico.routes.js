const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivos');

router.post('/', async (req, res) => {
  let busboy = new Busboy({ headers: req.headers });
  
  busboy.on('finish', async () => {
    try {
      const { salaoId, servico } = req.body; 
      console.log('Dados do serviço recebidos:', servico); // Log do serviço

      let errors = [];
      let arquivos = [];


      console.log(req.files); 

      // Verifique se há arquivos
      if (req.files && Object.keys(req.files).length > 0) {
        for (let key of Object.keys(req.files)) {
          const file = req.files[key];

          // Corrigido para usar 'split'
          const nameParts = file.name.split('.');
          const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
          const path = `servicos/${salaoId}/${fileName}`;

          const response = await aws.uploadToS3(file, path);

          if (response.error) {
            errors.push({ error: true, message: response.message });
          } else {
            arquivos.push(path);
          }
        }
      }

      if (errors.length > 0) {
        return res.status(500).json(errors[0]);
      }

      // Criar Serviço
      let servicoCadastrado;
      try {
        servicoCadastrado = await new Servico(servico).save();
        console.log('Serviço cadastrado com sucesso:', servicoCadastrado);
      } catch (saveErr) {
        console.error('Erro ao salvar serviço:', saveErr.message);
        return res.status(500).json({ error: true, message: 'Erro ao salvar serviço.' });
      }

      // Criar Arquivo
      const arquivosParaSalvar = arquivos.map((arquivo) => ({
        referenciaId: servicoCadastrado._id,
        model: 'Servico',
        caminho: arquivo,
      }));

      await Arquivos.insertMany(arquivosParaSalvar);

      res.json({ Servico: servicoCadastrado, arquivos: arquivosParaSalvar });
    } catch (err) {
      console.error('Erro no processamento da requisição:', err.message);
      res.status(500).json({ error: true, message: 'Erro interno do servidor.' });
    }
  });
  
  req.pipe(busboy);
});

module.exports = router;
