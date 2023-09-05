import * as PIXI from 'pixi.js'
import Victor from 'victor'
import Entity from '@/entity'

export default class Bullet extends Entity {
  public sprite
  public velocity
  private player
  private speed
  private radius
  private angle

  constructor(app: PIXI.Application, player: Entity) {
    super(app)
    this.player = player
    this.speed = 4
    this.radius = 8
    this.angle = this.player.rotation - Math.PI * 0.5
    this.sprite = new PIXI.Graphics()
    this.x = this.player.x
    this.y = this.player.y
    this.sprite.beginFill(0x0000ff, 1)
    this.sprite.drawCircle(0, 0, this.radius)
    this.sprite.endFill()
    this.velocity = new Victor(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(this.speed)
  }
}