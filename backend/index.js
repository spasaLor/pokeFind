const express = require('express');
const controller = require('./controller.js');
const cors = require("cors");
const path = require('path');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors({
  origin: 'https://pokefind-6w7o.onrender.com:5173',
  credentials: false
}));
app.use(express.static(path.join(__dirname,'dist')));
app.get("/get_pokemons",controller.getPokemons);
app.get("/leaderboard",controller.getLeaderboard);
app.post("/check_pokemon",controller.checkPokemon);
app.post("/save_score",controller.saveScore);
app.get("*splat",(req,res)=>{
  res.sendFile(path.join(__dirname,'dist','index.html'));
})
app.listen(8080,()=>console.log());
