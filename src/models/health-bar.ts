import * as PIXI from 'pixi.js'
import Entity from '@/entity'

export default class HealthBar extends Entity {
  public sprite
  private margin
  public tmpWidth
  private tmpHeight

  constructor(app: PIXI.Application) {
    super(app)
    this.margin = 16
    this.tmpWidth = this.app.screen.width - 2 * this.margin
    this.tmpHeight = 8
    this.sprite = new PIXI.Graphics()
    this.sprite.beginFill(0xff0000)
    this.sprite.drawRect(
      this.margin,
      this.app.screen.height - this.tmpHeight - this.margin * 0.5,
      this.tmpWidth,
      this.tmpHeight
    )
    this.sprite.endFill()
    this.sprite.zIndex = 1
    this.app.stage.sortableChildren = true
    this.app.stage.addChild(this.sprite)
  }
}
