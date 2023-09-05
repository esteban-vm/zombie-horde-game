import type Entity from '@/entity'
import type * as PIXI from 'pixi.js'
import Bullet from '@/bullet'

export default class Shooting {
  public app
  public player
  public bullets: Bullet[]
  public maxBullets
  private interval?: number

  constructor(app: PIXI.Application, player: Entity) {
    this.app = app
    this.player = player
    this.bullets = []
    this.maxBullets = 3
  }

  public update() {
    this.bullets.forEach((bullet) => {
      bullet.x += bullet.velocity.x
      bullet.y += bullet.velocity.y
    })
  }

  private fire = () => {
    if (this.bullets.length >= this.maxBullets) {
      const bullet = this.bullets.shift()!
      this.app.stage.removeChild(bullet.sprite)
    }
    this.bullets.forEach((bullet) => this.app.stage.removeChild(bullet.sprite))
    this.bullets = this.bullets.filter((bullet) => {
      const { x, y } = bullet
      const { width, height } = this.app.screen
      return Math.abs(x) < width && Math.abs(y) < height
    })
    this.bullets.forEach((bullet) => this.app.stage.addChild(bullet.sprite))
    const bullet = new Bullet(this.app, this.player)
    this.bullets.push(bullet)
    this.app.stage.addChild(bullet.sprite)
  }

  public set shoot(shooting: boolean) {
    if (shooting) {
      this.fire()
      this.interval = setInterval(this.fire, 500)
    } else {
      clearInterval(this.interval)
    }
  }
}
