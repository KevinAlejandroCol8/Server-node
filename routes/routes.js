const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const diskstorage = multer.diskStorage({
    destination: path.join(__dirname,'../images'),
    filename: (req,file,cb) => {
        cb(null, Date.now() + '-images-' + file.originalname)
    }
});

const fileAdd = multer({
    storage: diskstorage
}).single('image')

router.get('/', (req,res) =>{
    res.send("Welcome");
})

router.post('/images/post',fileAdd, (req,res) =>{
    
    req.getConnection((err,conn) => {
        if(err){
            return res.status(500).send('Server Error')
        }
        const type = req.file.mimetype;
        const name = req.file.originalname;
        const data = fs.readFileSync(path.join(__dirname,'../images/' + req.file.filename));

        conn.query('INSERT INTO image set ?', [{type,name,data}],(err,rows) => {
            if(err){
                return res.status(500).send('Server Error')
            }
            res.send('Imagen Agregada')
        })
    })
    //console.log(req.file);
})

router.get('/images/get', (req,res) =>{
    
    req.getConnection((err,conn) => {
        if(err){
            return res.status(500).send('Server Error')
        }

        conn.query('SELECT *FROM image',(err,rows) => {
            if(err){
                return res.status(500).send('Server Error')
            }
            //res.send('Imagenes Listadas');
            rows.map(img => {
                fs.writeFileSync(path.join(__dirname,'../dbimages/' +img.id + '-img.png'), img.data)
            });

            const nombres = fs.readdirSync(path.join(__dirname,'../dbimages/'))

            res.json(nombres);
            //res.json(rows);
            //console.log(rows);
        })
    })
    //console.log(req.file);
})

module.exports = router;