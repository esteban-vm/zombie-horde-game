import type Entity from '@/entity'
import * as PIXI from 'pixi.js'
import { Player, Spawner, Zombie } from '@/models'

const canvasSize = 512
const canvasView = document.querySelector('canvas')!

const app = new PIXI.Application({
  view: canvasView,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f,
})

const player = new Player(app)
const spawner = new Spawner(() => new Zombie(app, player))

app.ticker.add(() => {
  player.update()
  spawner.spawns.forEach((zombie) => zombie.update())
  bulletHitTest(player.shooting.bullets, spawner.spawns, 8, 16)
})

const bulletHitTest = (bullets: Entity[], zombies: Entity[], bulletRadius: number, zombieRadius: number) => {
  bullets.forEach((bullet) => {
    zombies.forEach((zombie, index) => {
      const dx = zombie.x - bullet.x
      const dy = zombie.y - bullet.y
      const distance = Math.sqrt(dx ** 2 + dy ** 2)
      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1)
        zombie.die()
      }
    })
  })
}
