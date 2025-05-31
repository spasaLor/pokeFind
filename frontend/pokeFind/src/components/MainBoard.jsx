import { useEffect, useState } from "react";

const initCoords = {
    x:0,
    y:0
}

function PokeModal({x,y,pokemonList,normalizedCoords,onFound}){
    const handleClick=async(e)=>{
        e.stopPropagation();
        const name=e.currentTarget.getAttribute("data-pokemon");
        const res=await fetch("http://localhost:8080/check_pokemon",
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({name,coordinates:normalizedCoords})
            }
        );
        const json=await res.json();
        if(json.message === 'Found')
            onFound(name);
    }
    return(
        <div className="modal" style={{top:y,left:x}}>
            <ul>
                {pokemonList.map(item=>(
                    item.found ? <li key={item.id} data-pokemon={item.name} className="found"> <b>{item.name}</b> <img src={item.img} alt="" /> </li> :
                    <li key={item.id} data-pokemon={item.name} onClick={handleClick}> <b>{item.name}</b> <img src={item.img} alt="" /> </li>
                ))}
            </ul>
        </div>
    );
}

export default function MainBoard({pokemonList,onFound}){
    const [modal,setModal]=useState(false);
    const [coords,setCoords]=useState(initCoords);
    const [norm,setNorm]=useState(initCoords);

    const toggleModal = (e)=>{
        setCoords({x:e.pageX,y:e.pageY});
        setModal(prev=>!prev);
        const img = e.target;
        const rect = img.getBoundingClientRect();
        const clickX=(e.clientX -rect.left);
        const clickY=(e.clientY - rect.top);
        setNorm({x:clickX / rect.width,y:clickY / rect.height});
    }

    useEffect(()=>{
        const image = document.querySelector('img');
        image.addEventListener('click',toggleModal);
        return ()=>window.removeEventListener('click',toggleModal);
    },[]);

    return(
        <>
            {modal && <PokeModal x={coords.x} y={coords.y} pokemonList={pokemonList} normalizedCoords={norm} onFound={onFound}/>}
            <img src="/poke.jpg "alt="" />
        </>
    );
}