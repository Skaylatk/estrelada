const express = require('express')
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public' ,'htmls', 'index.html'));
});

app.post('/submit', (req, res) => {
  const { username, idade, email, senha} = req.body;
  console.log(username, idade, email, senha)
  
})

app.listen(3000, () => {
  console.log('⏰ INICIANDO SITE.')
  setTimeout(function() {
    console.log('✅ SITE INICIADO.')
  }, 3000)
  
})