export default function Leaderboard({elements,onBack}){

    return(
        <div className="leaderboard">
            <div className="top"><button type="button" onClick={onBack}>Go back</button><h2>Top 5 times</h2></div>
            <ul>
                {elements.map(item=>(
                    <li key={item.id}><b>{item.username}</b> {item.time}</li>
                ))}
            </ul>
        </div>
    )
}