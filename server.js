var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishList');
const wishList = require('./model/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product',function(request,response){
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err,savedProduct){
        if(err){
            response.status(500).send({error: "Could not save product"});
        }else{
            response.send(savedProduct);
        }
    });
});

app.get('/product',function(request,response){
    Product.find({},function(err,products){
        if(err){
            response.status(500).send({error:"Could not send product"});
        }else{
            response.send(products);
        }
    });
});

app.get('/wishList',function(request,response){
    WishList.find({}).populate({path:'products'}).exec(function(err,wishLists){
        if(err){
            response.status(500).send({error:"could not fetch wishList"});
        }else{
            response.status(200).send(wishLists);
        }
    });
});

app.post('/wishList',function(request,response){
    var wishList = new wishList();
    wishList.title = request.body.title;
    wishList.save(function(err,newWishList){
        if(err){
            response.status(500).send({error:"Could not create wishList"});
        }else{
            response.send(newWishList);
        }
    });
});

app.put('/wishList/product/add',function(request,response){
    Product.findOne({_id: request.body.roductId},function(err,product){
        if(err){
            response.status(500).send({error: "could not add item to wishList"});
        }else{
            WishList .update({_id:request.body.wishListd},{$addToSet:{products: product._id}},function(err,wishList){
                if(err){
                    response.status(500).send({error: "could not add item to wishList"});
                }else{
                    response.send("Succesfully added to wishlist");
                }
            });
        }
    });
});

app.listen(3000,function(){
    console.log("Swag shop API");
});


