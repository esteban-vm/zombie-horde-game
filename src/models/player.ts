import type { Game, Spritesheet } from '@/types'
import { Assets, AnimatedSprite } from 'pixi.js'
import { AnimatedEntity } from '@/entity'
import HealthBar from '@/health-bar'
import Shooting from '@/shooting'

export default class Player extends AnimatedEntity {
  protected sprite!: AnimatedSprite
  protected spritesheet!: Spritesheet
  public shooting
  public dead
  public angle
  private lastButton
  private healthBar
  private maxHealth
  private healthLevel

  constructor(game: Game) {
    super(game)
    this.name = 'hero'
    this.angle = 0
    this.shooting = new Shooting(this, this.game)
    this.dead = false
    this.lastButton = 0
    this.healthBar = new HealthBar(this.game)
    this.maxHealth = 100
    this.healthLevel = this.maxHealth
    this.load()
  }

  protected async load() {
    this.spritesheet = <Spritesheet>await Assets.get(this.name)
    this.animations.push(new AnimatedSprite(this.spritesheet.animations['idle']))
    this.animations.push(new AnimatedSprite(this.spritesheet.animations['shoot']))
    this.sprite = new AnimatedSprite(this.spritesheet.animations['idle'])
    this.sprite.anchor.set(0.5)
    this.sprite.animationSpeed = 0.1
    this.sprite.play()
    this.x = this.game.width * 0.5
    this.y = this.game.height * 0.5
    this.game.add(this.sprite)
  }

  public update(delta: number) {
    // this.attack()
    if (this.dead) return
    const { global, buttons } = this.game.pointer
    this.angle = Math.atan2(global.y - this.y, global.x - this.x) + Math.PI * 0.5
    this.sprite.scale.x = global.x < this.x ? -1 : 1
    if (buttons !== this.lastButton) {
      const [idle, shoot] = this.animations
      this.sprite.textures = buttons === 0 ? idle.textures : shoot.textures
      this.sprite.play()
      this.shooting.shoot = buttons !== 0
      this.lastButton = buttons
    }
    this.shooting.update(delta)
  }

  public attack = () => {
    this.healthLevel--
    this.healthBar.width = (this.healthLevel / this.maxHealth) * this.healthBar.tmpWidth
    if (this.healthLevel <= 0) this.dead = true
  }
}
