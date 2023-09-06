import type { Game } from '@/types'
import * as PIXI from 'pixi.js'
import Victor from 'victor'
import Entity from '@/entity'

export default class Zombie extends Entity {
  public sprite
  private player
  private speed
  private attacking
  private interval?: number

  constructor(player: Entity, game: Game) {
    super(game)
    this.player = player
    this.sprite = new PIXI.Graphics()
    this.speed = 2
    this.radius = 16
    this.attacking = false
    const r = this.randomSpawnPoint()
    this.x = r.x
    this.y = r.y
    this.sprite.beginFill(0xff0000, 1)
    this.sprite.drawCircle(0, 0, this.radius)
    this.sprite.endFill()
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
