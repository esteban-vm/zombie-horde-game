import type { Game, Spritesheet } from '@/types'
import { AnimatedSprite } from 'pixi.js'
import Victor from 'victor'
import { AnimatedEntity } from '@/entity'

export default class Zombie extends AnimatedEntity {
  protected sprite!: AnimatedSprite
  protected spritesheet!: Spritesheet
  private player
  private speed
  private attacking
  private audio
  private interval?: number

  constructor(game: Game) {
    super(game)
    const names = this.game.zombieNames
    this.name = names[Math.floor(Math.random() * names.length)]
    this.player = this.game.player
    this.speed = 0
    this.attacking = false
    this.audio = new Audio('assets/squelch.mp3')
    this.load()
  }

  protected load() {
    super.load()
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
    this.sprite.scale.x = v.x < 0 ? 1 : -1
    this.x += v.x
    this.y += v.y
  }

  public attack = () => {
    if (this.attacking) return
    this.attacking = true
    this.interval = setInterval(this.player.attack, 500)
    this.sprite.textures = this.animations[1].textures
    this.sprite.animationSpeed = 0.1
    this.sprite.play()
  }

  public kill = () => {
    this.audio.currentTime = 0
    this.audio.volume = 0.5
    this.audio.play()
    this.sprite.textures = this.animations[0].textures
    this.sprite.loop = false
    this.sprite.onComplete = () => setTimeout(() => this.game.remove(this.sprite), 30_000)
    this.sprite.play()
    this.sprite.zIndex = -1
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
