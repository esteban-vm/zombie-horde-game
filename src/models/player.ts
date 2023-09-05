import * as PIXI from 'pixi.js'
import Entity from '@/entity'
import HealthBar from '@/health-bar'
import Shooting from '@/shooting'

export default class Player extends Entity {
  public sprite
  public shooting
  private lastButton
  private healthBar
  private maxHealth
  private healthLevel

  constructor(app: PIXI.Application) {
    super(app)
    this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    this.sprite.anchor.set(0.5)
    this.x = this.app.screen.width * 0.5
    this.y = this.app.screen.height * 0.5
    this.width = 32
    this.height = 32
    this.sprite.tint = 0xea985d
    this.app.stage.addChild(this.sprite)
    this.shooting = new Shooting(this.app, this)
    this.lastButton = 0
    this.healthBar = new HealthBar(this.app)
    this.maxHealth = 100
    this.healthLevel = this.maxHealth
  }

  public update() {
    // this.attack()
    const { global, buttons } = this.app.renderer.events.pointer
    const angle = Math.atan2(global.y - this.y, global.x - this.x) + Math.PI * 0.5
    this.rotation = angle
    if (buttons !== this.lastButton) {
      this.shooting.shoot = buttons !== 0
      this.lastButton = buttons
    }
    this.shooting.update()
  }

  public attack = () => {
    this.healthLevel--
    this.healthBar.width = (this.healthLevel / this.maxHealth) * this.healthBar.tmpWidth
    if (this.healthLevel <= 0) this
  }
}
