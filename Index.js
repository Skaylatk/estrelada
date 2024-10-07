const express = require('express')
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const SocketIo = require('socket.io')
const http = require('http')
const User = require('./models/user')


const app = express()
const server = http.createServer(app)
const io = SocketIo(server)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: '1024551649183260xxx',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
  
}))

mongoose.connect('mongodb+srv://alefdesalvador:filhodorei@sukita.kbmrt.mongodb.net/?retryWrites=true&w=majority&appName=Sukita')
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
  res.sendFile(path.join(__dirname,'public' ,'htmls', 'index.html'));
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
  } else {
    console.log(botname, message)
    const response = {
      mensagem: message,
      usuario: botname,
    }
    io.emit('mensagem', response)
    memsagens.push(response)
  }
});

app.use((req, res) => {
  res.status(404).send('<h1>Essa página não existe</h1>');
});

io.on('connection', (socket) => {
  console.log('👤 Novo usuario conectado:', socket.id)
  socket.emit('historico', memsagens)
  socket.on('mensagem', (msg) => {

    const username = socket.request.session.user?.username;
    const novamemsagem = { usuario: username, mensagem: msg}
    memsagens.push(novamemsagem)
    io.emit('mensagem', novamemsagem)
  })
});

server.listen(3000, () => {
  console.log('⏰ INICIANDO SITE.')
  setTimeout(function() {
    console.log('✅ SITE INICIADO.')
  }, 3000)

})