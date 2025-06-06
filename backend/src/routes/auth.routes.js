const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

const router = express.Router();

// Rota de cadastro
router.post('/register',
  // Validação
  [
    body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
    body('email').isEmail().withMessage('E-mail inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Verifica se usuário já existe
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário ou e-mail já cadastrado.' });
      }

      // Criptografa a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria novo usuário
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  }
);


// Rota de login
router.post('/login', 
    [
        body('email').isEmail().withMessage('E-mail inválido'),
        body('password').notEmpty().withMessage('Senha é obrigatória')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { email, password } = req.body;
        
        try {
            // Busca o usuário pelo email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Usuário ou senha incorretos' });
            }
            
            // Compara a senha enviada com a senha criptografada no banco
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Usuário ou senha incorretos' });
      }
      
      // Cria o token JWT com informações do usuário (payload)
      const token = jwt.sign(
        { userId: user._id, username: user.username }, 
        process.env.JWT_SECRET, // chave secreta que você deve criar no .env
        { expiresIn: '1h' } // expira em 1 hora
    );
    
    // Retorna o token para o cliente
    res.json({ token });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login' });
}
}
);

module.exports = router;