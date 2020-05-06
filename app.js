const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 2020;




const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'gestion_disponibilite'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('Database Connected!');
});


app.use(express.static(path.join(__dirname, 'public','css')));
app.use(express.static(path.join(__dirname, 'public', 'img')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));





//------------------------------------Routes Part----------------------------------

app.get('/',(req, res) => {

    let sql = "SELECT * FROM produit";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('Produit', {
            title : 'All Products',
            rows : rows
        });

    });
});

app.get('/rayons',(req, res) => {

    let sql = "SELECT * FROM rayons";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('rayons', {
            title : 'Explorer les Rayons',
            rows : rows
        });

    });
});

app.get('/Fournisseur',(req, res) => {

    let sql = "SELECT * FROM fournisseur";
    connection.query(sql, (err, rows) => {
      console.log(rows);
        if(err) throw err;
        res.render('fournisseur', {
            title : 'Nos Fournisseur',
            rows : rows
        });

    });
});

app.get('/addProduit',(req, res) => {
  let idR ;
  let sql1 = "SELECT id_rayon FROM rayons";
  connection.query(sql1, (err, rows) => {
    idR = rows;
      if(err) throw err;
        });
    res.render('AjoutProduit', {
        title : 'Ajouter Un produit',
        idR : idR
    });

});

app.post('/SaveProduit',(req, res) => {

    let data = {id_produit: req.body.idP, id_fournisseur: req.body.idF, id_rayon: req.body.idR, nom_produit: req.body.nom, quantite: req.body.quantite};
    let sql = "INSERT INTO produit SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/');
    });
});


app.get('/addFournisseur',(req, res) => {

    res.render('AjoutFournisseur', {
        title : 'Ajouter Un Nouveau Fournisseur',

    });

});

app.post('/SaveFournisseur',(req, res) => {

    let data = {id_fournisseur: req.body.id_f, nom: req.body.nom_f, tel: req.body.tel};
    let sql = "INSERT INTO fournisseur SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/Fournisseur');
    });
});



app.get('/addRayon',(req, res) => {

    res.render('AjoutRayons', {
        title : 'Ajouter Un Nouveau Rayon',

    });

});

app.post('/SaveRayons',(req, res) => {

    let data = {id_rayon: req.body.id_r, nbr_fornisseur: req.body.nbr_f, nbr_produit: req.body.nbr_p};
    let sql = "INSERT INTO rayons SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;
      res.redirect('/rayons');
    });
});






app.get('/edit/:userId',(req, res) => {

    const auteurId = req.params.userId;
    let sql = `Select * from produit where id_produit = ${auteurId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('UpdateAuteur', {
            title : 'Modification produit',
            row : result[0]
        });
    });
});

app.post('/update',(req, res) => {

  let userId = req.body.id;


    let sql = `update auteurs SET Nom = '${req.body.nom}', Age = ${req.body.age}, Nationalite = '${req.body.natio}' where id_Auteur = ${userId}`;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});



app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from auteurs where id_Auteur = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


app.listen(port, (error)=>{
  console.log(`Listening on port ${port}`);
});
