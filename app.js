require('dotenv').config({path:'.env'});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
app.use(bodyParser.json());
const path = require('path');
const { check, validationResult } = require('express-validator');

const db = require("./db");
const collection = "links";

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public', {
    extensions: ['html', 'htm'],
}));

app.get('/api',(req,res)=>{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.post('/post', [
    check('type').not().isEmpty().escape(),
    check('title').not().isEmpty().escape(),
    check('link').isURL().not().isEmpty().escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection(collection).insertOne({type: req.body.type, title: req.body.title, link: req.body.link, creationDate: new Date()});
        // res.send('Data received:\n' + JSON.stringify(req.body.text));
        res.redirect('/');
})

db.connect((err)=>{
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', ()=>{
            console.log('connected to database, app listening on port 3000')
        });
    }
})