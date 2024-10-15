import { Camera } from './src/Camera.js';
import { GameLoop } from './src/GameLoop.js';
import { GameObject } from './src/GameObject.js';
import { gridCells } from './src/helpers/grid.js';
import { Input } from './src/Input.js';
import { Hero } from './src/objects/Hero/Hero.js';
import { Rod } from './src/objects/Rod/Rod.js';
import { resources } from './src/Resource.js';
import { Sprite } from './src/Sprite.js';
import { Vector2 } from './src/Vector2.js';
import './style.css';

// Grabbing the canvas to draw to
const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

// Establish the root scene
const mainScene = new GameObject({
  position: new Vector2(0,0)
})

// Build up the scene by adding a sky, ground, and hero
const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(320, 180)
})

const groundSprite = new Sprite({
  resource: resources.images.ground,
  frameSize: new Vector2(320, 180)
})

mainScene.addChild(groundSprite);

const hero = new Hero(gridCells(6),  gridCells(5))
mainScene.addChild(hero);

const camera = new Camera();
mainScene.addChild(camera);

const rod = new Rod(gridCells(7), gridCells(6))
mainScene.addChild(rod);

// Add an Input class to the main scene
mainScene.input = new Input();

// Establish update and draw loops
const update = (delta) => {
  mainScene.stepEntry(delta, mainScene)
}

const draw = () => {

  // Clear anything stale
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  skySprite.drawImage(ctx, 0 , 0);

  // Save the current state (for camera offset)
  ctx.save();

  //Offset by camera position
  ctx.translate(camera.position.x, camera.position.y);

   // Draw objects in the mounted scene
   mainScene.draw(ctx, 0, 0);

   // Restore to original state
   ctx.restore();
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();