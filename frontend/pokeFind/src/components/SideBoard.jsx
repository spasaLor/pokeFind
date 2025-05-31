export default function SideBoard({pokemonList}){
    return(
        <div className="sidebar">
            <h2>Find these pokemon</h2>
            <ul>
                {pokemonList.map(item=>(
                    item.found ? <li key={item.id}> <b>{item.name}</b> <img src={item.img} alt="" className="found" /></li>: <li key={item.id}> <b>{item.name}</b> <img src={item.img} alt="" /></li>               
                ))}
            </ul>
        </div>
    );
}