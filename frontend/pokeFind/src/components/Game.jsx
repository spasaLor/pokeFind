import { useEffect, useState } from "react";
import MainBoard from "./MainBoard";
import SideBoard from "./SideBoard";
import Leaderboard from "./Leaderboard";

export default function Game(){
    const [pokemons,setPokemons]=useState([]);
    const [isFinished,setIsFinished]=useState(false);
    const [leaderboard,setLeaderboard]=useState([]);
    const [start,setStart]=useState(Date.now());
    const [end,setEnd]=useState(0);
    const [username,setUsername]=useState('');
    const [showLeaderboard, setShowLeaderboard]=useState(false);

    useEffect(()=>{
        const fetchData = async()=>{
            const data = await fetch("https://pokefind-6w7o.onrender.com/get_pokemons");
            const json = await data.json();
            setPokemons(json);
        };
        fetchData();
        return()=>setPokemons([]);
    },[]);

    const foundPokemon= (name)=>{
        const newList = pokemons.map(item=> item.name===name ? {...item,found:true} : item);
        setPokemons(newList);
        if(newList[0].found && newList[1].found && newList[2].found){
            setEnd(Date.now());
            setIsFinished(true);
        }
    }

    const save = async()=>{
        const time=(end-start)/1000;
        const res = await fetch("https://pokefind-6w7o.onrender.com/save_score",
        {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({time,username})
        }
        );
        const json=await res.json();
        if(res.ok){
            window.location.reload();
        }
        console.log(json);
    }

    const leaderboardClick = async()=>{
        setShowLeaderboard(true);
        try {
            const data = await fetch("https://pokefind-6w7o.onrender.com/leaderboard");
            const json=await data.json();
            setLeaderboard(json.leaderboard);
        } catch (error) {
            console.log("Database error");
        }
    }

    const goBack = ()=>{
        setShowLeaderboard(false);
    }

   return (
  <>
    <div className="container">
      <MainBoard pokemonList={pokemons} onFound={foundPokemon} />
    </div>
    <SideBoard pokemonList={pokemons} />
    
    {isFinished && (
      <div className="scoreModal">
        <div className="content">
          {showLeaderboard ? (
            <Leaderboard elements={leaderboard} onBack={goBack}/>
          ) : (
            <>
              <h2>Woohoo you found 'em all!</h2>
              <div className="time">
                <p>Your time:</p>
                <b id="time">{((end - start) / 1000).toFixed(2)}s</b>
              </div>
              <div className="user">
                <label htmlFor="username">Name</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button type="button" onClick={save}>Save and go again</button>
              <button type="button" onClick={leaderboardClick}>Leaderboard</button>
            </>
          )}
        </div>
      </div>
    )}
  </>
);

}