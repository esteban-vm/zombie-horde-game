import type { Game } from '@/types'
import { Graphics } from 'pixi.js'
import { Entity } from '@/entity'

export default class HealthBar extends Entity {
  protected sprite
  private margin
  public tmpWidth
  private tmpHeight

  constructor(game: Game) {
    super(game)
    this.margin = 16
    this.tmpWidth = this.game.width - 2 * this.margin
    this.tmpHeight = 8
    this.sprite = new Graphics()
    this.sprite.beginFill(0xff0000)
    this.sprite.drawRect(
      this.margin,
      this.game.height - this.tmpHeight - this.margin * 0.5,
      this.tmpWidth,
      this.tmpHeight
    )
    this.sprite.endFill()
    this.sprite.zIndex = 1
    this.game.sort = true
    this.game.add(this.sprite)
  }
}
