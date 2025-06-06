const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/review');

const router = express.Router();

// Criar nova avaliação
router.post(
  '/',
  [
    body('user').notEmpty().withMessage('ID do usuário é obrigatório'),
    body('albumTitle').notEmpty().withMessage('Título do álbum é obrigatório'),
    body('artist').notEmpty().withMessage('Nome do artista é obrigatório'),
    body('rating').isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newReview = new Review(req.body);
      await newReview.save();
      res.status(201).json(newReview);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar avaliação' });
    }
  }
);

// Listar todas as avaliações
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
});

// 🔹 Atualizar avaliação por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Avaliação não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar avaliação' });
  }
});

// 🔹 Deletar avaliação por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Avaliação não encontrada' });
    res.json({ message: 'Avaliação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar avaliação' });
  }
});

module.exports = router;
