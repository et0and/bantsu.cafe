require('dotenv').config({path:'.env'});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
app.use(bodyParser.json());
const path = require('path');
const rateLimit = require("express-rate-limit");
const { check, validationResult } = require('express-validator');

const db = require("./db");

const apiLimiter = rateLimit({
  windowMs: 10000,
  max: 5
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public', {
    extensions: ['html', 'htm'],
}));

app.get('/links',(req,res)=>{
    db.getDB().collection('links').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.get('/statuses',(req,res)=>{
    db.getDB().collection('statuses').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.post('/post', apiLimiter, [
    check('type').not().isEmpty().escape(),
    check('title').not().isEmpty().escape(),
    check('link').isURL().not().isEmpty().escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection('links').insertOne({type: req.body.type, title: req.body.title, link: req.body.link, creationDate: new Date()});
        // res.send('Data received:\n' + JSON.stringify(req.body.text));
        res.redirect('/');
});

app.post('/post-status', apiLimiter, [
    check('name').not().isEmpty().escape(),
    check('status').not().isEmpty().escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection('statuses').insertOne({name: req.body.name, status: req.body.status, creationDate: new Date()});
        res.redirect('/');
});

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