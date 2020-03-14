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
  windowMs: 5000,
  max: 1
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
            // console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.get('/statuses',(req,res)=>{
    db.getDB().collection('statuses').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            // console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.get('/notes',(req,res)=>{
    db.getDB().collection('notes').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            // console.log(documents);
            res.send(documents.reverse());
        }
    });
});

app.get('/light-status',(req,res)=>{
    db.getDB().collection('lights').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            // console.log(documents);
            res.send(documents);
        }
    });
});

app.post('/post', apiLimiter, [
    check('type').not().isEmpty().isLength({ max: 1000 }).escape(),
    check('title').not().isEmpty().isLength({ max: 1000 }).escape(),
    check('link').isURL().not().isEmpty().isLength({ max: 1000 }).escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection('links').insertOne({type: req.body.type, title: req.body.title, link: req.body.link, creationDate: new Date()})

        // res.send('Data received:\n' + JSON.stringify(req.body.text));
        res.redirect('/');
});

app.post('/post-status', apiLimiter, [
    check('name').not().isEmpty().isLength({ max: 100 }).escape(),
    check('status').not().isEmpty().isLength({ max: 5000 }).escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection('statuses').insertOne({name: req.body.name, status: req.body.status, creationDate: new Date()});
        res.redirect('/');
});

app.post('/post-note', apiLimiter, [
    check('emoji').not().isEmpty().isLength({ max: 5 }).escape()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
        db.getDB().collection('notes').insertOne({emoji: req.body.emoji, creationDate: new Date()});
        res.redirect('/#success');
});

app.post('/light-switch', (req, res) => {

    db.getDB().collection('lights').find({}).toArray((err,documents)=>{
        if(err)
            console.log(err)
        else{
            // console.log(documents);
            console.log('this', documents[0].on);

            if (documents[0].on == 'true') {
                db.getDB().collection('lights').findOneAndUpdate({type: "incandescent"}, {$set: {on: 'false'}}, function(err, doc) {
                    console.log(doc);
                });
            } else {
                db.getDB().collection('lights').findOneAndUpdate({type: "incandescent"}, {$set: {on: 'true'}}, function(err, doc) {
                    console.log(doc);
                });
            }
            res.redirect('/');

        }
    });

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