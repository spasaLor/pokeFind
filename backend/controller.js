const {PrismaClient} = require('./generated/prisma');
const prisma = new PrismaClient();

const getPokemons =async (req,res)=>{
    let pokemon;
    try {
        pokemon = await prisma.$queryRaw` SELECT id,name FROM "pokemon" ORDER BY RANDOM() LIMIT 3;`;
        
    } catch (error) {
        console.log(error);
    }
    await Promise.all(
        pokemon.map(async(item)=>{
            const res = await fetch("https://pokeapi.co/api/v2/pokemon/"+item.name);
            const json = await res.json();
            item.img = json.sprites.front_default;
            item.found=false;
        })
    );
    res.status(200).json(pokemon);
}

const checkPokemon = async(req,res)=>{
    const data = req.body;
    const poke = await prisma.pokemon.findFirst({
        where:{
            name:data.name
        }
    });
    if(data.coordinates.x >= poke.bbox_x && data.coordinates.x < (poke.bbox_x+poke.bbox_width) )
        if(data.coordinates.y >= poke.bbox_y && data.coordinates.y < (poke.bbox_y+poke.bbox_height) )
            return res.status(200).json({message:"Found"});
    return res.json({message:"Incorrect"});
}
const saveScore = async(req,res)=>{
    const {time,username} = req.body;
    await prisma.leaderboard.create({
        data:{
            username:username,
            time:time
        }
    });
    res.status(200).json({message:"saved"});
}
const getLeaderboard= async(req,res)=>{
    const leaderboard=await prisma.leaderboard.findMany({
        take:5,
        orderBy:{time:'asc'}
    });
    res.status(200).json({leaderboard});

}
module.exports={getPokemons,checkPokemon,saveScore,getLeaderboard}