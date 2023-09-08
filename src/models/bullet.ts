import type { Game, Player } from '@/types'
import { Graphics } from 'pixi.js'
import Victor from 'victor'
import { Entity } from '@/entity'

export default class Bullet extends Entity {
  public sprite
  public velocity
  private player
  private speed
  private angle

  constructor(game: Game, player: Player) {
    super(game)
    this.player = player
    this.speed = 4
    this.radius = 8
    this.angle = this.player.angle - Math.PI * 0.5
    this.sprite = new Graphics()
    this.x = this.player.x
    this.y = this.player.y
    this.sprite.beginFill(0x0000ff, 1)
    this.sprite.drawCircle(0, 0, this.radius)
    this.sprite.endFill()
    this.velocity = new Victor(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(this.speed)
  }
}
