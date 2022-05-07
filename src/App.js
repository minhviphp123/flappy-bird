import styled from "styled-components"
import { useEffect, useState } from "react";
import Icon from "./img/bird.png";

const bird_size = 60;
const game_space_width = 500;
const game_space_height = 500;
const gravity = 5;
const jump_height = 100;
const obstacle_width = 40;
const obstacle_gap = 200;

function App() {
   const [birdPosition, setBirdPosition] = useState(game_space_height/2);
   const [gameStarted, setGameStarted] = useState(false);
   const [obstacleHeight, setObstacleHeight] = useState(0)  ;
   const [obstacleLeft, setObstacleLeft] = useState(game_space_width - obstacle_width);
   const [score, setScore] = useState(0);
   const bottomObstacleHeight = game_space_height - obstacle_gap - obstacleHeight
  
  // falling
   useEffect(() => {
     let timeId;
     if(gameStarted && birdPosition < game_space_height - bird_size){
        timeId = setInterval(() => {
         setBirdPosition(birdPosition => birdPosition + gravity)
       }, 24)
     }

  return () => {
    clearInterval(timeId)
  }
   },[birdPosition, gameStarted]);

  //  obstacle run
   useEffect(()=> {
    let obstacleId; 
    if(gameStarted && obstacleLeft >= 0) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft => obstacleLeft - 5))
      },24)

      return () => {
        clearInterval(obstacleId)
      }
     } else {
       setObstacleLeft(game_space_width - obstacle_width)
       setObstacleHeight(Math.floor(Math.random() * (game_space_height - obstacle_gap)));
       setScore((score) => score + 1)
     }
   },[gameStarted, obstacleLeft]);

  //  collide and score
   useEffect(() => {
     const hasCollideTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
     const hasCollideBottomObstacle = birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;
     if(
       obstacleLeft >= 0 &&
       obstacleLeft <= obstacle_width &&
       (hasCollideTopObstacle || hasCollideBottomObstacle)
     ) {
       setGameStarted(false);
     }
   },[birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft])
   
  // jump
   const handleClick = () => {
    let newBirdPosition = birdPosition - jump_height;
    if(!gameStarted) {
      setGameStarted(true);
    } else if(newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition)
    }
   }

  return (
    <Div onClick={handleClick}>
      <GameBox height={game_space_height} width={game_space_width}>
        <Obstacle 
          top={0}
          width={obstacle_width}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle 
          top={game_space_height - (obstacleHeight + bottomObstacleHeight)}
          width={obstacle_width}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={bird_size} top = {birdPosition} src={Icon}/>
      </GameBox>
      <span> { score } </span>
    </Div>

  );
}

export default App;

const Bird = styled.img`
  position: absolute;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50px;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.height}px;
  background-color: lightblue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;