import type { Game, Player, Spritesheet } from '@/types'
import { Assets, AnimatedSprite } from 'pixi.js'
import Victor from 'victor'
import { AnimatedEntity } from '@/entity'

export default class Zombie extends AnimatedEntity {
  protected sprite!: AnimatedSprite
  protected spritesheet!: Spritesheet
  private player
  private speed
  private attacking
  private interval?: number

  constructor(game: Game, player: Player) {
    super(game)
    this.name = this.game.zombieNames[Math.floor(Math.random() * this.game.zombieNames.length)]
    this.player = player
    this.speed = 0
    this.attacking = false
    this.load()
  }

  protected async load() {
    this.spritesheet = <Spritesheet>await Assets.get(this.name)
    this.animations.push(new AnimatedSprite(this.spritesheet.animations['die']))
    this.animations.push(new AnimatedSprite(this.spritesheet.animations['attack']))
    this.animations.push(new AnimatedSprite(this.spritesheet.animations['walk']))
    this.sprite = new AnimatedSprite(this.spritesheet.animations['walk'])
    this.speed = this.name === 'quick' ? 1 : 0.25
    this.sprite.anchor.set(0.5)
    this.sprite.animationSpeed = this.name === 'quick' ? 0.2 : 0.1
    this.sprite.play()
    const r = this.randomSpawnPoint()
    this.x = r.x
    this.y = r.y
    this.game.add(this.sprite)
  }

  public update(delta: number) {
    const e = new Victor(this.x, this.y)
    const s = new Victor(this.player.x, this.player.y)
    if (e.distance(s) < this.player.width * 0.5) {
      this.attack()
      return
    }
    const d = s.subtract(e)
    const v = d.normalize().multiplyScalar(this.speed * delta)
    this.x += v.x
    this.y += v.y
  }

  public attack = () => {
    if (this.attacking) return
    this.attacking = true
    this.interval = setInterval(this.player.attack, 500)
  }

  public die = () => {
    this.game.remove(this.sprite)
    clearInterval(this.interval)
  }

  private randomSpawnPoint() {
    const edge = Math.floor(Math.random() * 4)
    const canvasSize = this.game.width
    const spawnPoint = new Victor(0, 0)
    switch (edge) {
      case 0: // top
        spawnPoint.x = canvasSize * Math.random()
        break
      case 1: // right
        spawnPoint.x = canvasSize
        spawnPoint.y = canvasSize * Math.random()
        break
      case 2: // bottom
        spawnPoint.x = canvasSize * Math.random()
        spawnPoint.y = canvasSize
        break
      case 3: // left
        spawnPoint.x = 0
        spawnPoint.y = canvasSize * Math.random()
        break
    }
    return spawnPoint
  }
}
