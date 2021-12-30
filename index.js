
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import Author from "./model/Author.js";
import {Book} from "./model/Book.js";
import {AttachResponder,ErrorHandler} from './config/errorConfig.js'
import {HttpInternalServerError,HttpError,HttpBadRequest,HttpNotFound} from './error.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import  swaggerUi  from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import {swaggerOptions} from "./config/swaggerOption.js"
import fileUpload from 'express-fileupload';
import {User} from "./model/User.js";
import {BookBuilder} from "./payload/testing.js";

const specs = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(fileUpload({
    createParentPath: true
}));



var router = express.Router();

var url='mongodb+srv://metrayim:q1w2e3r4@tracluster.novpf.mongodb.net/Testing?retryWrites=true&w=majority'

app.use(cookieParser())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    exposedHeaders: ["Link"]
}));
 // app.use(express.static(__dirname + '/public'));
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs));

router.get("/hello",async (req,res)=>{
    try{


        const doc = new User({ name: 'Vahhhh', picture: '/123yyyy.png' });
        // doc.picture; // 'https://s3.amazonaws.com/mybucket/123.png'

        console.log(doc.picture,"hello")
        console.log(doc.get("picture"))
        // doc.aggregate
        doc.toObject({ getters: true }).picture; // '/123.png'

       let bookBuilder=new BookBuilder("hello work")
           .setType(null)
           .setPrice(1000).build();
            console.log(bookBuilder)

         doc.save();
        return res.send({response:doc})


    }catch (err){
        console.log(err)
    }
})

router.get("/get_hello",async (req,res,next)=>{

    // const user=await User.aggregate([{$match: {_id: mongoose.Types.ObjectId('61c3daadebc67a94fa054038')}}])
    const user=await User.find({$text:{$search:"val"}, $caseSensitive: true})
    return res.send({response: user})
})

router.post("/upload-avatar",async (req,res)=>{
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

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
        var book=new Book({title:req.body.title,author:'61b06ad9a0a5a66dd1c771d8',drink:req.body.drink,book_type:{name:"Horror"}})
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


router.route('/book').get(async (req,res)=>{
    // Book.find({},((error, result) => {
    //     return res.send(result)
    // }))
    // Book.find({},'title author',(err,response)=>{
    //     if(err){
    //         let {message}=err;
    //         return res.send({message:message})
    //     }
    //   return  res.send({response:response})
    // })
    var name="title";
    var tea='';

   const query= Book.findOne();
   const queryAuthor=Author.find();

   // query.where("title").gte("g");
   //
   query.where('drink').gte("Tea")

   query.select("title author drink")

    // console.log(query.getQuery())
    query.populate("author","name")

  const book= await query.exec();

    const author= await queryAuthor.where("_id").gt(book.author).populate("books")

    console.log(author,"testing")


    // console.log(authors,"author")
    res.send({response:author})


})

router.route("/book/:id").put(async (req,res,next)=>{

    return res.respond.badRequest(HttpBadRequest, {reason: 'User ID not found'})

    // Book.findByIdAndUpdate(req.params.id,{title:req.body.title}, {upsert: true},((err, doc) => {
    //     return res.send(doc);
    // }))
})

router.route("/book/:id").delete(async (req,res,next)=>{
    Book.findByIdAndDelete(req.params.id,)
})

router.route("/book-pu").get(async (req,res,next)=>{
    const book= await Book.find().populate('author',null,null,{name:'testina'});
    res.send(book)
})

router.route("/book-date").get(async (req,res,next)=>{

    // queryRequest(req)
    let reqObject=req.query;
    let reqQuery;
    let titleQ=`/.*`+reqObject['title']?reqObject["title"]:""+`.*/`
    // console.log(req.query)

    if (!reqObject.keys) {
         reqQuery = {
            title:  new RegExp('.*' + reqObject['title'] + '.*'),
             // book_type:{
             //     $elemMatch : {
             //         name:new RegExp('.*' + reqObject['book_type'] + '.*'),
             //     }
             // },
             authors:{
                $elemMatch: {
                    name:reqObject['username'],
                }
             }
             // 'photos': {
             //     $elemMatch : {
             //         'text' : 'good'
             //     }
             // }
        }
    }
    if(req.body.start_date&&req.body.end_date){
        reqQuery.created_at={
            $gte: req.body.start_date,
            $lt: req.body.end_date
        }
    }
    console.log(reqQuery,"my query")

    // console.log(reqObject['start_date'],"start_date")
    //
    //
    // console.log(reqQuery,"log2")



    const myCustomLabels = {
        totalDocs: 'total_data',
        docs: 'data_response',
        limit: 'per_page',
        page: 'current_page',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'page_count',
        pagingCounter: 'paging_counter',
        meta: 'paginator',
        hasPrevPage:'has_prev_page',
        hasNextPage:'has_next_page',
    };

    const options = {
        page: 1,
        limit: 20,
        // offset: 3,
        collation: {
            locale: 'en',
        },
         populate:["author"],
        customLabels:myCustomLabels
    };

  const book1=await  Book.find({ //query today up to tonight
      created_at: {
          $gte: '2021-12-01',
          $lt: '2021-12-9'
      }
  }).populate('author');
    const book=await Book.paginate(reqQuery,options)



    res.status(200)
    res.send(book)
})


router.route("/book_find").get(async (req,res,next)=>{
    const options = {
        page: 1,
        limit: 10,
        collation: {
            locale: 'en',
        },
    };
    console.log(req.query,"helo")

    Book.paginate(req.query,options,(err,result)=>{
        res.send({message:result})
    })
})


router.route("/register").post(async (req,res,next)=>{
    try{
        const {username,password}=req.body;
        if(!(username && password )){
           return  res.status(400).send("All input is required");
        }
        const author=await Author.findOne({name:username})
        console.log(author,"hello")
        if(author){
            return res.status(409).send("user alredy exist, Pleas login")
        }

        //Encrypt user password
       const encryptedPassword = await bcrypt.hash(password, 10);

        const newAuthor=await Author.create({
            name:username,
            password:encryptedPassword
        })

        const token=jwt.sign({
            user_id:newAuthor._id
        },"dkdkkdkdkd")

        newAuthor.token=token;

        res.status(201).json(newAuthor)


    }catch (err){
        console.log("Error:",err)
    }

})

router.route("/login").post(async (req,res,next)=>{

})


router.route("/setcookies").get(async (req,res,next)=>{
    try {
        res.cookie("username","john",{maxAge:90000,httpOnly:true});
        res.send("Cookie has been set")
    }catch (err){
        res.send(err);
    }
})

router.route("/getcookies").get(async (req,res,next)=>{
    try {

        var username=req.cookies['username']

        if(username){
            return res.send(username);
        }

        return res.send('No cookie found');

    }catch (err){
        res.send(err);
    }
})


app.use(AttachResponder)

app.use('/api', router);

app.use(ErrorHandler)

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true  }, () => {
    console.log("Connected to DB")
});

app.listen(4000);



const queryRequest=(req)=>{

    let reqObject=req.query;

    let reqQuery={};

    let titleQ=`/.*`+reqObject['title']+`.*/`

    console.log(reqQuery.params)

    if (!reqObject.keys) {
        // reqQuery = {
        //     title:  new RegExp('.*' + reqObject['title'] + '.*'),
        // }
        Object.keys(reqObject).forEach(key=>{
            console.log(key,"ke1")

            reqQuery[key]=[]
                Object.keys(reqObject[key]).forEach(_key=>{
                    reqQuery[key].push(_key)
                })
        })
    }

    console.log(reqQuery,"we tesitng")


    // if(req.body.start_date&&req.body.end_date){
    //     reqQuery.created_at={
    //         $gte: req.body.start_date,
    //         $lt: req.body.end_date
    //     }
    // }

    return reqQuery;
}
