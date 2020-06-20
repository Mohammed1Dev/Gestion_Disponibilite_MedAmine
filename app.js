const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 7777;




const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'gestion_disponibilite'
});

connection.connect((error)=>{
    if(error) console.log(error);
     console.log('Database Connected!');
});


app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public','img')));
app.use(express.static(path.join(__dirname,'public','css')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));





//------------------------------------Routes Part----------------------------------

app.get('/Home',(req, res) => {

    let sql = "SELECT * FROM produit";
    connection.query(sql, (err, rows) => {
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
  let idR;
  let idF;
  let sql1 = "SELECT id_rayon FROM rayons";
  let sql2 =  "SELECT id_fournisseur FROM fournisseur"
  connection.query(sql1, (err, rows) => {

    idR = rows;
      if(err) throw err;
      connection.query(sql2, (err, rows) => {
        idF = rows;
          if(err) throw err;
      res.render('AjoutProduit', {
          title : 'Ajouter Un produit',
          idR : idR,
          idF : idF

      });
      });
        });


});

app.post('/SaveProduit',(req, res) => {

    let data = {id_rayon: req.body.idrayon, id_fournisseur: req.body.idfour,nom_produit: req.body.nom, quantite: req.body.quant};
    let sql = "INSERT INTO produit SET ?";
    connection.query(sql, data,(err, results) => {
      if(err) return err;

      res.redirect('/Home');
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






app.get('/editProduct/:id',(req, res) => {

    const productId = req.params.id;

    let sqlid =  `SELECT * FROM produit WHERE id_produit = ${productId}`;
     connection.query(sqlid,(err, result) => {
        let row;
        if(err) throw err;
          row = result[0];
          let idR;
          let idF;
          let sql1 = "SELECT id_rayon FROM rayons";
          let sql2 =  "SELECT id_fournisseur FROM fournisseur"
          connection.query(sql1, (err, rows1) => {

            idR = rows1;
              if(err) throw err;
              connection.query(sql2, (err, rows2) => {
                idF = rows2;
                  if(err) throw err;
          res.render('UpdateProduit', {
              title : 'Modification produit',
              row : row,
              idR : idR,
              idF : idF
          });
      });
  });



});
});




app.post('/updateProduct',(req, res) => {

  let productId = req.body.idP;
console.log(productId);

    let sql = `UPDATE produit SET id_rayon = '${req.body.idrayon}', id_fournisseur = ${req.body.idfourn}, nom_produit = '${req.body.nom}', quantite = ${req.body.Qun} where id_produit = ${productId}`;
     connection.query(sql,(err, results) => {

      if(err) throw err;
      res.redirect('/Home');
    });
});



app.get('/editForn/:FournId',(req, res) => {

    let FournId = req.params.FournId;
    let sql = `Select * from fournisseur where id_fournisseur = ${FournId}`;
     connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('updateForn', {
            title : 'Modification Fournisseur',
            row : result[0]

        });

    });
});

app.post('/updateForn',(req, res) => {

  let fornId = req.body.idF;


    let sql = `UPDATE fournisseur SET nom = '${req.body.nomf}', tel = ${req.body.tel} where id_fournisseur = ${fornId}`;
    connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/Fournisseur');
    });
});



app.get('/editRayon/:RayonId',(req, res) => {

    let RayonId = req.params.RayonId;
    let sql = `Select * from rayons where id_rayon = ${RayonId}`;
     connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('updateRayon', {
            title : 'Modification Rayons',
            row : result[0]

        });

    });
});

app.post('/updateRayon',(req, res) => {

  let RayonId = req.body.idR;


    let sql = `UPDATE rayons SET nbr_produit = '${req.body.nbrP}', nbr_fornisseur = ${req.body.nbrF} where id_rayon = ${RayonId}`;
    connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/rayons');
    });
});



app.get('/deleteProduct/:productId',(req, res) => {
    const productId = req.params.productId;
    let sql = `DELETE from produit where id_produit = ${productId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/Home');
    });
});

app.get('/deleteForn/:fornId',(req, res) => {
    const fornId = req.params.fornId;
    let sql = `DELETE from fournisseur where id_fournisseur = ${fornId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/Fournisseur');
    });
});

app.get('/deleteRayon/:rayonId',(req, res) => {
    const rayonId = req.params.rayonId;
    let sql = `DELETE from rayons where id_rayon = ${rayonId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/rayons');
    });
});

app.listen(port, (error)=>{
  console.log(`Listening on port ${port}`);
});
