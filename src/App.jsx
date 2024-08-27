import './App.css'
import {Game} from './Game'
function App() {
  return (
    <>
      <div className="game-list">
        <Game name="Ninja Dodge" image="/src/assets/ninjadodge.png" winCondition="Hoàn thành màn 2" link="https://haiphan2309.itch.io/ninja-dodge"/>
        <Game name="Falling Shapes" image="/src/assets/fallingshapes.png" winCondition="Đạt 1000 điểm" link="https://haiphan2309.itch.io/falling-shapes"/>
        <Game name="Hexalink" image="/src/assets/hexalink.png" winCondition="Hoàn thành 4 màn" link="https://gedusx.itch.io/hexalink"/>
        <Game name="Mazexpand" image="/src/assets/mazexpand.png" winCondition="Hoàn thành 5 màn" link="https://beastkr.itch.io/mazexpand/"/>
        <Game name="Shooting Gallery" image="/src/assets/shootinggallery.png" winCondition="Đạt 180 điểm" link="https://gloxiniaaa.github.io/UnityWebGL_Shooting-Gallery/"/>
        <Game name="Play with the devil" image="/src/assets/playwiththedevil.png" winCondition="Hoàn thành màn 2" link="https://lehien6601.github.io/PlayWithTheDevil/"/>
        <Game name="Penguins On Ice" image="/src/assets/penguinsonice.png" winCondition="Đạt 6 điểm" link="https://haiphan2309.itch.io/penguins-on-ice"/>
        <Game name="Shepherd" image="/src/assets/shepherd.png" winCondition="Hoàn thành trò chơi" link="https://gloxiniaaa.github.io/UnityWebGL_Shepherd-For-Eveyone/"/>
      </div>
    </>
  )
}

export default App
