import './App.css'
import {Game} from './Game'
import logo1 from './assets/ninjadodge.png'
import logo2 from './assets/fallingshapes.png'
import logo3 from './assets/hexalink.png'
import logo4 from './assets/mazexpand.png'
import logo5 from './assets/shootinggallery.png'
import logo6 from './assets/playwiththedevil.png'
import logo7 from './assets/penguinsonice.png'
import logo8 from './assets/shepherd.png'
function App() {
  return (
    <>
      <div className="game-list">
        <Game name="Ninja Dodge" image={logo1} winCondition="Hoàn thành màn 2" link="https://haiphan2309.itch.io/ninja-dodge"/>
        <Game name="Falling Shapes" image={logo2} winCondition="Đạt 1000 điểm" link="https://haiphan2309.itch.io/falling-shapes"/>
        <Game name="Hexalink" image={logo3} winCondition="Hoàn thành 4 màn" link="https://gedusx.itch.io/hexalink"/>
        <Game name="Mazexpand" image={logo4} winCondition="Hoàn thành 5 màn" link="https://beastkr.itch.io/mazexpand/"/>
        <Game name="Shooting Gallery" image={logo5} winCondition="Đạt 180 điểm" link="https://gloxiniaaa.github.io/UnityWebGL_Shooting-Gallery/"/>
        <Game name="Play with the devil" image={logo6} winCondition="Hoàn thành màn 2" link="https://lehien6601.github.io/PlayWithTheDevil/"/>
        <Game name="Penguins On Ice" image={logo7} winCondition="Đạt 6 điểm" link="https://haiphan2309.itch.io/penguins-on-ice"/>
        <Game name="Shepherd" image={logo8} winCondition="Hoàn thành trò chơi" link="https://gloxiniaaa.github.io/UnityWebGL_Shepherd-For-Eveyone/"/>
      </div>
    </>
  )
}

export default App
