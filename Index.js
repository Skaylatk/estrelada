const express = require('express')
const path = require('path');
const app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public' ,'htmls', 'index.html'));
});

app.post('/submit', (req, res) => {
  const { username, senha} = req.body;
  console.log(username, senha)
  res.send('<h1> O SITE AINDA NAO ESTA PRONTO!')

});

app.use((req, res) => {
  res.status(404).send('<h1>Essa página não existe</h1>');
});

app.listen(3000, () => {
  console.log('⏰ INICIANDO SITE.')
  setTimeout(function() {
    console.log('✅ SITE INICIADO.')
  }, 3000)

})