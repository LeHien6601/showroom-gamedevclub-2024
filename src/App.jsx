import './App.css'
import {Game} from './Game'
import logo1 from './assets/ninjadodge.png'
import logo2 from './assets/fallingshapes.png'
import logo3 from './assets/hexalink.png'
import logo4 from './assets/guard-me.png'
import logo5 from './assets/shootinggallery.png'
import logo6 from './assets/playwiththedevil.png'
import logo7 from './assets/penguinsonice.png'
import logo8 from './assets/shepherd.png'
import logo9 from './assets/boomboom.png'
function App() {
  return (
    <>
      <div className="game-list">
        <Game name="Ninja Dodge" image={logo1} winCondition="" link="https://haiphan2309.itch.io/ninja-dodge"/>
        <Game name="Falling Shapes" image={logo2} winCondition="" link="https://haiphan2309.itch.io/falling-shapes"/>
        <Game name="Hexalink" image={logo3} winCondition="" link="https://gedusx.itch.io/hexalink"/>
        <Game name="Guard Me" image={logo4} winCondition="" link="https://beastkr.itch.io/guard-me"/>
        <Game name="Shooting Gallery" image={logo5} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_Shooting-Gallery"/>
        <Game name="Play with the devil" image={logo6} winCondition="" link="https://lehien6601.github.io/PlayWithTheDevil"/>
        <Game name="Penguins On Ice" image={logo7} winCondition="" link="https://haiphan2309.itch.io/penguins-on-ice"/>
        <Game name="Shepherd" image={logo8} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_Shepherd-For-Eveyone"/>
        <Game name="BoomBoom" image={logo9} winCondition="" link="https://gloxiniaaa.github.io/UnityWebGL_BoomBoom"/>
      </div>
    </>
  )
}

export default App
