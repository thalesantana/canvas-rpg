import { Animations } from "../../Animations.js";
import { FrameIndexPattern } from "../../FrameIndexPattern.js";
import { GameObject } from "../../GameObject.js";
import { gridCells, isSpaceFree } from "../../helpers/grid.js";
import { DOWN, LEFT, RIGHT, UP } from "../../Input.js";
import { walls } from "../../levels/level1.js";
import { resources } from "../../Resource.js";
import { Sprite } from "../../Sprite.js";
import { Vector2 } from "../../Vector2.js";
import { moveTowards } from '../../helpers/moveTowards.js';
import {
  // PICK_UP_DOWN,
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  WALK_UP
} from "./heroAnimations.js";

export class Hero extends GameObject {
  constructor(x, y) {
    super({
      position: new Vector2(x, y)
    });

    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8,-19),
    })
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.hero,
      frameSize: new Vector2(32, 32),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      position: new Vector2(-8,-20),
      animations: new Animations({
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkUp: new FrameIndexPattern(WALK_UP),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standUp: new FrameIndexPattern(STAND_UP),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        //pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
      })
    })
    this.addChild(this.body);

    this.facingDirection = DOWN;
    this.destinationPosition = this.position.duplicate();
  }

  step(delta, root) {
    const distance = moveTowards(this, this.destinationPosition, 1)
    const hasArrived = distance <= 1;
    //  Attempt to move again if the rero is at his position
    if (hasArrived) {
      this.tryMove(root)
    }
  }

  tryMove(root) {
    const {input} = root;

    if (!input.direction) {
  
      if (this.facingDirection === LEFT) { this.body.animations.play("standLeft")}
      if (this.facingDirection === RIGHT) { this.body.animations.play("standRight")}
      if (this.facingDirection === UP) { this.body.animations.play("standUp")}
      if (this.facingDirection=== DOWN) { this.body.animations.play("standDown")}
  
      return;
    }
  
    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;
    const gridSize = 16;
  
    if(input.direction === DOWN) {
      nextY += gridSize; 
      this.body.animations.play("walkDown")
    }
    if(input.direction === UP) {
      nextY -= gridSize;
      this.body.animations.play("walkUp") 
    }
    if(input.direction === LEFT) {
      nextX -= gridSize;
      this.body.animations.play("walkLeft")
    }
    if(input.direction === RIGHT) {
      nextX += gridSize;
      this.body.animations.play("walkRight")
    }
  
    this.facingDIrection = input.direction ?? this.facingDIrection ;
  
    // Validating that the next destination is free
    if(isSpaceFree(walls, nextX, nextY )){
      this.destinationPosition.x = nextX;
      this.destinationPosition.y = nextY;
    }
  }
}