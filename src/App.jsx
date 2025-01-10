import './App.css'
import {Game} from './Game'
import logo from '../public/logo.png'
import {useState, useEffect} from 'react'
function App() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    fetch('scratch-games.json')
      .then(response => response.json())
      .then(data => setGames(data))
  }, []);

  const [ugames, setUGames] = useState([]);
  useEffect(() => {
    fetch('unity-games.json')
      .then(response => response.json())
      .then(data => setUGames(data))
  }, []);
  return (
    <>
      <div className="top">
        <a href='https://www.facebook.com/hcmutGDC'><img src={logo} className="logo"></img></a>
      </div>
      
      <div className="game-list">
        {ugames.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} key={game.id}/>
        ))}
      </div>
      <p className='middle'>Scratch games</p>
      <div className="game-list">
        {games.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} key={game.id}/>
        ))}
      </div>
    </>
  )
}

export default App
