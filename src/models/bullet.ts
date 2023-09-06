import type { Game } from '@/types'
import * as PIXI from 'pixi.js'
import Victor from 'victor'
import Entity from '@/entity'

export default class Bullet extends Entity {
  public sprite
  public velocity
  private player
  private speed
  private angle

  constructor(player: Entity, game: Game) {
    super(game)
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

  public update() {}
}
