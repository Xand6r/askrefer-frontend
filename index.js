const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'client','build');
const assetsPath = path.join(__dirname, 'assets');
const port = process.env.PORT || 8000;

app.use(express.static(publicPath));
// app.use(express.static(assetsPath));

app.get('/ads.txt', (req, res) => {
   res.redirect('https://lib.tashop.co/prodeus/ads.txt');
});
app.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});
app.listen(port, () => {
   console.log('Server is up on port', port);
});