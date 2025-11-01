import './Game.css'

export function Game({name, image, winCondition, link}) {
    return <a className="game-container" href={link} target='_blank'>
        <p>{winCondition}</p>
        <img src={image} alt="Gameplay" width="365" height="150"></img>
        <h1>{name}</h1>
    </a>
}