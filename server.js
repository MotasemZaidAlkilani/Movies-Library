'use strict'

const express=require('express');
const cors=require('cors');
const data=require('./Movie Data/data.json');
const server=express();
server.use(cors());
server.get('/',Movie_handle_data);
server.get('/favorite',favorite_page);
server.get('/505',server_error);
server.get('/404',page_not_found);
server.listen(3000,()=>{
console.log("hi");
});
function Movie_data(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}
function Movie_handle_data(request,respone){
    let movie=[];
    data.movie.forEach(val=>{
        let obj=new Movie_data(val.title,val.poster_path,val.overview);
        movie.push(obj);
    });
   return respone.status(200).send(movie);
}
function favorite_page(req,res){
    return res.status(203).send("Welcome to Favorite Page");
}
function server_error(request,reponse){
    return reponse.status(500).send("Server Error");
}
function page_not_found(request,reponse){
    return reponse.status(500).send("page not found error");
}