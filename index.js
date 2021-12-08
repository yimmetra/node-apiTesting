
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import Author from "./model/Author.js";
import {Book} from "./model/Book.js";

const app = express();

var router = express.Router();

var url='mongodb+srv://metrayim:q1w2e3r4@tracluster.novpf.mongodb.net/Testing?retryWrites=true&w=majority'


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    exposedHeaders: ["Link"]
}));
 // app.use(express.static(__dirname + '/public'));

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/test', function(req, res) {
    let arr = [3, 4, 5, 6];
    let modifiedArr = arr.map(function(element){
        return element *3;
    });

    console.log(modifiedArr); // [9, 12, 15, 18]
    res.json({ message: modifiedArr });
});


router.route('/author')
    .post(function (req,res){
        var author=new Author();
            author.name=req.body.name;
        author.save(author)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Tutorial."
                });
            });
    })

router.route('/book')
    .post((req,res)=>{
        var book=new Book({title:req.body.title,author:'61b06ad9a0a5a66dd1c771d8',drink:req.body.drink})
        let error=book.validateSync();
        if(error){
            let {message}=error;
            return res.send({message:message})
        }
        book.save(book)
            .then(data=>{
                return res.send(data);
            }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
    })


router.route('/book').get((req,res)=>{
    Book.find({},((error, result) => {
        return res.send(result)
    }))
})
app.use('/api', router);

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true  }, () => {
    console.log("Connected to DB")
});

app.listen(3000);