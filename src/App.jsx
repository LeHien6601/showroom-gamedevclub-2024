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
        {games.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} key={game.id}/>
        ))}
      </div>
      
      <div className="game-list">
        {ugames.map((game) => (
          <Game name={game.name} image={game.image} link={game.link} key={game.id}/>
        ))}
      </div>
      {/* <div className="game-list">
        <Game name="Falling Shapes" image={logo2} winCondition="" link="https://haiphan2309.itch.io/falling-shapes"/>
        <Game name="Ninja Dodge" image={logo1} winCondition="" link="https://haiphan2309.itch.io/ninja-dodge"/>
        <Game name="Falling Shapes" image={logo2} winCondition="" link="https://haiphan2309.itch.io/falling-shapes"/>
        <Game name="Hexalink" image={logo3} winCondition="" link="https://gedusx.itch.io/hexalink"/>
        <Game name="Guard Me" image={logo4} winCondition="" link="https://beastkr.itch.io/guard-me"/>
        <Game name="Shooting Gallery" image={logo5} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_Shooting-Gallery"/>
        <Game name="Play with the devil" image={logo6} winCondition="" link="https://lehien6601.github.io/PlayWithTheDevil"/>
        <Game name="Penguins On Ice" image={logo7} winCondition="" link="https://haiphan2309.itch.io/penguins-on-ice"/>
        <Game name="Shepherd" image={logo8} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_Shepherd-For-Eveyone"/>
        <Game name="BoomBoom" image={logo9} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_BoomBoom"/>
        <Game name="Fall Blabs" image={logo10} winCondition="" link="https://haiphan2309.itch.io/fall-blabs"/>
      </div> */}
    </>
  )
}

export default App
