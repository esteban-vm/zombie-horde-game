import type { Game } from '@/types'
import { Sprite, Texture } from 'pixi.js'
import Victor from 'victor'
import { Entity } from '@/entity'

export default class Bullet extends Entity {
  public sprite!: Sprite
  public velocity
  private player
  private speed
  private angle

  constructor(game: Game) {
    super(game)
    this.name = 'bullet'
    this.player = this.game.player
    this.speed = 4
    this.radius = 8
    this.angle = this.player.angle - Math.PI * 0.5
    this.sprite = new Sprite(Texture.from(this.name))
    this.velocity = new Victor(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(this.speed)
    this.sprite.anchor.set(0.5)
    this.sprite.scale.set(0.2)
    this.x = this.player.x
    this.y = this.player.y
    this.rotation = this.player.angle
  }
}
