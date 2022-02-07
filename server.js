'use strict'
require('dotenv').config();
const express=require('express');
const pg=require('pg');
const cors=require('cors');
const axios=require('axios');
const data=require('./Movie Data/data.json');

const APIKEY=process.env.APIKEY;
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
   

const server=express();
server.use(cors());
server.use(express.json());
server.get('/',Movie_handle_data);
server.get('/favorite',favorite_page);
server.get('/trending',getDataFromApi);
server.get('/search',search_Movie_name);
server.put('/getMovie/:id',getMovie);
server.post('/addMovie',addMovie);
server.put('/UPDATE/:id',updateMovie);
server.put('/DELETE/:id',deleteMovie);

server.use(server_error);
server.use('*',page_not_found);

const port=process.env.PORT;
let url=`https://api.themoviedb.org/3/movie/550?api_key=${process.env.APIKEY}`;
let url_for_search=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=The&page=2&number=2`;


client.connect().then(()=>{
server.listen(port,()=>{
console.log("worked");
})
})

function Movie_Data_From_Api(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}

function Movie_data(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

function addMovie(request,response){
    const movie=request.body;
    let sql=`INSERT INTO movie_table(id,title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
    let values=[movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview];
    client.query(sql,values).then(data =>{
     response.status(200).json(data.rows);
    }).catch(err=>{
        server_error(err,request,response);
    })
}


function movie_name(original_title){
    this.original_title=original_title;
}

function getMovie(request,response){
    let id=request.params.id;
    console.log(id);
    let sql=`SELECT * FROM movie_table WHERE id=${id};`;
    client.query(sql).then(data=>{
        response.status(200).json(data.rows);

    }).catch(err=>{
        server_error(err,request,response);
    })
}
function updateMovie(request,resonse){
 let id=request.params.id;
 const movie=request.body;  
let sql=`UPDATE movie_table SET title = $1,release_date = $2,poster_path = $3,overview = $4 WHERE id= $5 RETURNING *;`;
let values=[movie.title,movie.release_date,movie.poster_path,movie.overview,id];
client.query(sql,values).then(data=>{
    resonse.status(200).json(data.rows);
}).catch(err=>{
    server_error(err,request,resonse);
})
}
function deleteMovie(request,response){
let id=request.params.id;
 let sql=`DELETE FROM movie_table WHERE id=${id};`;
 client.query(sql).then(()=>{
     response.status(200).send("Deleted");
 }).catch(err=>{
    server_error(err,request,response);
 })
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
