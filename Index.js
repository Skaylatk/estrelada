const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const { WebSocketServer} = require("node:ws")
const SocketIo = require('socket.io');
const http = require('http')
const User = require('./models/user');


const app = express()
const server = http.createServer(app)
const wss = WebSocketServer({server})

const sessionmi = session({
  secret: '1024551649183260xxx',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60480000 }
  
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(helmet())
app.use(express.urlencoded({ extended: true }));
app.use(sessionmi)

mongoose.connect('')
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB', err));

let memsagens = [];

function requireLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/')
  }
  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public' ,'htmls', 'Index.html'));
});

app.get('/cadastrar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'htmls', 'cdtr.html'));
})

app.post('/submit', async (req, res) => {
  const { email, senha} = req.body;
  const usuario = await User.findOne({ email, senha})
  if (usuario) {
    req.session.user = {
      username: usuario.username,
      email: usuario.email,
      senha: usuario.senha
    }
    res.redirect('/chat')
  } else {
    res.redirect("/cadastrar")
  
  }

});

app.post('/subdastro', async (req, res) => {
  const { username, email, senha} = req.body;
  // cadastro
  usuario = new User({
    username,
    email,
    senha
  });
  await usuario.save();
  
})

app.get('/chat', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'htmls', 'chat.html'));
  
})

app.post('/api/v1', (req, res) => {
  const {token , botname, message} = req.body;
  if (token !== '409-655') {
    res.status(401).json({ error: 'Invalid token.'})
  } else if (!token) {
    return res.status(401).json({error: 'Token is required.'})
  }
  try {
    const response = {
      usuario: botname,
      mensagem: message
    };
    
    return res.status(201).json({success: 'Operation completed successfully.'})
  } catch(error) {
    return res.status(401).json({error: `An error occurred while sending the request.\n${error}`})
  }
});

app.use((req, res) => {
  res.status(404).send('<h1>Essa página não existe</h1>');
});

wss.on('connection', (ws, req) => {
  const username = req.session.user.name
  ws.send(JSON.stringify({type: "histórico", data: memsagens}))
  ws.on('message', (message) => {
    const novamessage = {usuario: username, mensagem: message}
    ws.send(JSON.stringify({type: "mensagem", data: novamessage}))
  });
})

server.listen(3047, () => {
  console.log('⏰ INICIANDO SITE.')
  setTimeout(function() {
    console.log('✅ SITE INICIADO.')
  }, 3000)

})
