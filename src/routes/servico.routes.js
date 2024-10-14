const express = require('express');
const router = express.Router();
const multer = require('multer'); // Importar o multer
const uploadConfig = require('../config/multer'); // Importar configuração do multer
const UploadImagesService = require('../services/UploadImagesService.js');
const DeleteImagesService = require('../services/DeleteImageService.js');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivos');

const upload = multer(uploadConfig.storage); 

// Testar conexão S3
router.get('/test-s3', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      MaxKeys: 5,
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error('Erro ao conectar ao S3:', err);
        res.status(500).json({ error: true, message: 'Falha na conexão com o S3.' });
      } else {
        console.log('Conectado ao S3. Objetos encontrados:', data.Contents);
        res.json({
          error: false,
          message: 'Conexão com S3 bem-sucedida!',
          arquivos: data.Contents,
        });
      }
    });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Adicionar novo serviço com upload de imagens
router.post('/', upload.array('images', 10), async (req, res) => {
  console.log(req.files); // Verifique o que está chegando aqui
  console.log(req.body);  // Veja o conteúdo do corpo da requisição
  const uploadImagesService = new UploadImagesService();
  let arquivos = [];

  try {
    for (const file of req.files) {
      const response = await uploadImagesService.execute(file);
      arquivos.push({
        path: response.Location,
        fileName: file.filename,
      });
    }

    const jsonServico = JSON.parse(req.body.servico);
    jsonServico.salaoId = req.body.salaoId;
    const servico = await new Servico(jsonServico).save();

    const arquivosData = arquivos.map(arquivo => ({
      referenciaId: servico._id,
      model: 'Servico',
      caminho: arquivo.path,
    }));

    await Arquivos.insertMany(arquivosData);
    res.json({ error: false, arquivos });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// Atualizar serviço existente
router.put('/:id', upload.array('images', 10), async (req, res) => {
  const uploadImagesService = new UploadImagesService();
  let arquivos = [];

  try {
    for (const file of req.files) {
      const response = await uploadImagesService.execute(file);
      arquivos.push({
        referenciaId: req.params.id,
        model: 'Servico',
        caminho: response.Location,
      });
    }

    const jsonServico = JSON.parse(req.body.servico);
    await Servico.findByIdAndUpdate(req.params.id, jsonServico);

    const arquivosData = arquivos.map(arquivo => ({
      referenciaId: req.params.id,
      model: 'Servico',
      caminho: arquivo.path,
    }));

    await Arquivos.insertMany(arquivosData);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Obter serviços de um salão específico
router.get('/salao/:salaoId', async (req, res) => {
  try {
    let servicosSalao = [];
    const servicos = await Servico.find({
      salaoId: req.params.salaoId,
      status: { $ne: 'E' },
    });
    for (let servico of servicos) {
      const arquivos = await Arquivos.find({
        model: 'Servico',
        referenciaId: servico._id,
      });
      servicosSalao.push({ ...servico._doc, arquivos });
    }
    res.json({
      error: false,
      servicos: servicosSalao,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Função para Remover Arquivo
router.post('/remove-arquivo', async (req, res) => {
  const deleteImagesService = new DeleteImagesService();

  try {
    const { arquivo } = req.body;
    await deleteImagesService.execute(arquivo);
    await Arquivos.findOneAndDelete({ caminho: arquivo });
    res.json({ error: false, message: 'Arquivo excluído com sucesso!' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Excluir serviço (marcar como excluído)
router.delete('/:id', async (req, res) => {
  try {
    await Servico.findByIdAndUpdate(req.params.id, { status: 'E' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
