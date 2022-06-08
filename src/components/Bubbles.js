// ts-ignore
import React, { Component } from 'react';

/**
 * This simulates roughly the windows bubbles screen saver.
 * It will genereate the given number of balls that move in the window with random speeds and directions. Every ball changes its speed over time and once it stopped it changes the direction before accelerating again. The balls can collide with each other after they have once been "free", when they did not overlap with any other ball.
 */

/* TODO
- correct the collisions. They are kinda wrong, most of the times. The balls bounce in the wrong direction sometimes
- avoid the "gluing" (two balls glued together)
- avoid "gluing" to the walls
*/

class Ball extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showId: false
    };
  }

  render() {
    return (
      <div className="ball" style={{left:this.props.ball.x-50, top:this.props.ball.y-50}}>
        <div className="ball-text">
          {this.state.showId && this.props.ball.id}
        </div>
      </div>
    );
  }
}

export default class Bubbles extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      balls: [],
      numBalls: 5,
      minSpeed: 0.3,
      maxSpeed: 5,
      ballRadius: 20,
      isRunning: true, // set to true to start the simulation right away
      acc: true // should the balls change their speed (and their direction when speed reached 0)?
    };
  }

  _spawnBalls = () => {
    const numBalls = this.state.numBalls
    const minX = this.state.ballRadius
    const maxX = window.innerWidth-this.state.ballRadius
    const minY = this.state.ballRadius
    const maxY = window.innerHeight-this.state.ballRadius
    const minSpeed = this.state.minSpeed
    const maxSpeed = this.state.maxSpeed
    const acc = this.state.acc ? (0.01 * (Math.random() < 0.5 ? -1 : 1)) : false

    let balls = []
    
    for( let i=0; i<numBalls; i++){
      let ball = {
        id: i,
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY,
        acc,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        angle: Math.random() * 360,
        canCollide: false
      }
      balls.push(ball)
    }

    this.setState({balls})
  }

  _updateBallPos = () => {
    let newBalls = []
    this.state.balls.forEach( ball => {

      // define acceleration and change direction
      if(ball.acc){
        if(ball.acc > 0 && ball.speed >= this.state.maxSpeed){
          ball.acc = ball.acc * -1
        }else if (ball.acc < 0 && ball.speed <= 0.1){
          ball.angle = Math.random()*360
          ball.acc = ball.acc * -1
        }

        // set new speed
        ball.speed = ball.speed + ball.acc
      }

      // check if ball collides with wall and change angle
      if(ball.x-this.state.ballRadius-ball.speed < 0 || ball.x+this.state.ballRadius+ball.speed > window.innerWidth){
          ball.angle = 180 - ball.angle
      }
      if(ball.y-this.state.ballRadius-ball.speed < 0 || ball.y+this.state.ballRadius+ball.speed > window.innerHeight){
        ball.angle = 360 - ball.angle
      }

      // clip the angle to 0 and 360
      ball.angle = ball.angle % 360; 

      // force it to be the positive remainder, so that 0 <= angle < 360  
      ball.angle = (ball.angle + 360) % 360; 

      // set new position based on angle and speed
      ball.x = ball.x + ball.speed * Math.cos(ball.angle * Math.PI / 180)
      ball.y = ball.y + ball.speed * Math.sin(ball.angle * Math.PI / 180)

      // check if the ball is now free (no overlap with any other ball)
      if(!ball.canCollide){
        ball.canCollide = this._enableCollision(ball)
      }

      newBalls.push(ball)
    })
    this.setState({balls: newBalls})
  }

  _detectCollision = () => {
    let newBalls = Array(this.state.balls.length).fill(false)
    this.state.balls.forEach( (ball, ballIndex) => {
      if(newBalls[ballIndex]){
        // ball already calculated
        return
      }else if(!ball.canCollide){
        // this ball can not collide (jet)
        newBalls.splice(ballIndex, 1, ball)
        return
      }
      this.state.balls.forEach( (otherBall, otherBallIndex) => {
        if(ballIndex == otherBallIndex){
          // same ball
          return
        }
        if(newBalls[otherBallIndex]){
          // already calculated
          return
        }
        if(!otherBall.canCollide){
          // the other ball can not collide (jet)
          return
        }

        // check for collision
        const ballDist = Math.sqrt(Math.pow(ball.x-otherBall.x, 2) + Math.pow(ball.y-otherBall.y, 2))

        if(ballDist <= this.state.ballRadius*2){

          /* Disabled for now as it doesn't solve the gluing problem AND disables valid collisions 
          // check if balls are on collision course (or have already hit)
          // 1. get the difference between the two angles
          // atan2(sin(x-y), cos(x-y))
          const angleDiff = Math.atan2(Math.sin(ball.angle-otherBall.angle), Math.cos(ball.angle - otherBall.angle))
          // 2. do the dot product of the two vectors (angles)
          const dotProduct = ball.speed*otherBall.speed*Math.cos(angleDiff)
          // return if they don't point in same direction (this avoids the gluing, but also creates cases without collisions)
          // how to account for same direction (ie one ball faster than the other and going in the same direction)?
          if(dotProduct <= 0){
            return
          }
          */

          // calculate collision: 
          // https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
          const ballAngleRad = ball.angle * Math.PI / 180
          const otherBallAngleRad = otherBall.angle  * Math.PI / 180

          let hitAngle = Math.atan2(ball.y - otherBall.y, ball.x - otherBall.x)

          const ballXspeed = otherBall.speed * Math.cos(otherBallAngleRad - hitAngle) * Math.cos(hitAngle) + ball.speed * Math.sin(ballAngleRad - hitAngle) * Math.sin(hitAngle)
          const ballYspeed = otherBall.speed * Math.cos(otherBallAngleRad - hitAngle) * Math.sin(hitAngle) + ball.speed * Math.sin(ballAngleRad - hitAngle) * Math.cos(hitAngle)

          const otherBallXspeed = ball.speed * Math.cos(ballAngleRad - hitAngle) * Math.cos(hitAngle) + otherBall.speed * Math.sin(otherBallAngleRad - hitAngle) * Math.sin(hitAngle)
          const otherBallYspeed = ball.speed * Math.cos(ballAngleRad - hitAngle) * Math.sin(hitAngle) + otherBall.speed * Math.sin(otherBallAngleRad - hitAngle) * Math.cos(hitAngle)

          const ballAngle = Math.atan2(ballYspeed, ballXspeed) * 180 / Math.PI
          const otherBallAngle = Math.atan2(otherBallYspeed, otherBallXspeed) * 180 / Math.PI

          const ballSpeed = Math.sqrt(Math.pow(ballXspeed,2) + Math.pow(ballYspeed,2))
          const otherBallSpeed = Math.sqrt(Math.pow(otherBallXspeed,2) + Math.pow(otherBallYspeed,2))

          // NOTE, I am setting canCollide to false after EVERY collsion. This resolves the gluing problem,
          // but causes valid collisions to be missed. 

          const newBall = Object.assign({}, ball, {angle: ballAngle, speed: ballSpeed, canCollide: false })
          const newOtherBall = Object.assign({}, otherBall, {angle: otherBallAngle, speed: otherBallSpeed, canCollide: false })

          newBalls.splice(ballIndex, 1, newBall)
          newBalls.splice(otherBallIndex, 1, newOtherBall)
        }
      })
      if(!newBalls[ballIndex]){
        // no collision for this ball
        newBalls.splice(ballIndex, 1, ball)
      }
    })
    this.setState({
      balls: newBalls
    })
  }

  _enableCollision = (ball) => {
    // if there is any one ball that is touching the given ball, return false
    return !this.state.balls.find( otherBall => {
      if(ball.id === otherBall.id){
        // skip the current ball
        return false
      }

      const ballDist = Math.sqrt(Math.pow(ball.x-otherBall.x, 2) + Math.pow(ball.y-otherBall.y, 2))

      if(ballDist <= this.state.ballRadius*2){
        return true
      }else{
        return false
      }
    })
  }

  _onButtonClick = (e) => {
    e.preventDefault()
    this.setState({
      isRunning: !this.state.isRunning
    })
  }

  componentDidMount(){
    this._spawnBalls()
    setInterval( () => {
      if(this.state.isRunning){
        this._updateBallPos()
        this._detectCollision()
      }
    }, 20)
  }

  render() {

    return (
      <div style={{zIndex: -200}}>
        <button 
          onClick={ this._onButtonClick }
        >
        </button>
      {
        this.state.balls.map(ball => <Ball key={ball.id} ball={ball}/>)
      }
      </div>
    );
  }
}
