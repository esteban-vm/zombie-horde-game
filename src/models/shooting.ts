import type { Game, Player } from '@/types'
import Bullet from '@/bullet'

export default class Shooting {
  public game
  public player
  public bullets: Bullet[]
  private maxBullets
  private interval?: number

  constructor(player: Player, game: Game) {
    this.game = game
    this.player = player
    this.bullets = []
    this.maxBullets = 3
  }

  public update(delta: number) {
    this.bullets.forEach((bullet) => {
      bullet.x += bullet.velocity.x * delta
      bullet.y += bullet.velocity.y * delta
    })
  }

  private fire = () => {
    if (this.bullets.length >= this.maxBullets) {
      const bullet = this.bullets.shift()!
      this.game.remove(bullet.sprite)
    }
    this.bullets.forEach((bullet) => this.game.remove(bullet.sprite))
    this.bullets = this.bullets.filter((bullet) => {
      const { x, y } = bullet
      const { width, height } = this.game
      return Math.abs(x) < width && Math.abs(y) < height
    })
    this.bullets.forEach((bullet) => this.game.add(bullet.sprite))
    const bullet = new Bullet(this.game, this.player)
    this.bullets.push(bullet)
    this.game.add(bullet.sprite)
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
