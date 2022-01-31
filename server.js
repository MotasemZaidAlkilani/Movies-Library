'use strict'
require('dotenv').config();
const express=require('express');
const cors=require('cors');
const axios=require('axios');
const data=require('./Movie Data/data.json');

const server=express();
server.use(cors());

server.get('/',Movie_handle_data);
server.get('/favorite',favorite_page);
server.get('/trending',getDataFromApi);
server.get('/search',search_Movie_name);
server.get('*',page_not_found);

server.use(server_error);

const port=process.env.PORT;
let url=`https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}`;
let url_for_search=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2&number=2`;

server.listen(port,()=>{
console.log("worked");
});
function Movie_Data_From_Api(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}
function movie_name(original_title){
    this.original_title=original_title;
}
function Movie_data(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}
function getDataFromApi(request,response){
    axios.get(url).then((res)=>{ 
     let obj=new Movie_Data_From_Api(res.data.id,res.data.title,res.data.release_date,res.data.poster_path,res.data.overview); 
     
     return response.status(200).json(obj);  
    }).catch((err)=>{
       server_error(err,request,response);
    })
}
function search_Movie_name(request,respone){
 axios.get(url_for_search).then((res)=>{
     let result=res.data.results.map(value=>{
     let obj=new movie_name(value.original_title);
     return obj;
    })
     respone.status(200).json(result);
 })
}

function Movie_handle_data(request,respone){
  let obj=new Movie_data(data.title,data.poster_path,data.overview);
   return respone.status(200).send(obj);
}
function favorite_page(req,res){
    return res.status(203).send("Welcome to Favorite Page");
}
function server_error(error,request,reponse){
   const err={
       status:500,
       message:'server error'
   }
   reponse.status(500).send(err);
}
function page_not_found(request,reponse){
    return reponse.status(400).send("page not found error");
}