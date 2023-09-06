import type { Sprite } from '@/types'
import * as PIXI from 'pixi.js'
import Player from '@/player'
import Spawner from '@/spawner'
import Zombie from '@/zombie'

export default class Game {
  private app
  private player
  private zombies
  private startScene
  private overScene
  public started

  constructor() {
    const size = 512
    const view = document.querySelector('canvas')!
    const backgroundColor = 0x5c812f
    this.app = new PIXI.Application({ view, width: size, height: size, backgroundColor })
    this.player = new Player(this)
    const spawner = new Spawner(this, () => new Zombie(this.player, this))
    this.zombies = spawner.spawns
    this.started = false
    this.init()
    this.startScene = this.createScene('Click to Start')
    this.overScene = this.createScene('Game Over')
    document.addEventListener('click', this.start)
  }

  public add(sprite: Sprite) {
    this.app.stage.addChild(sprite)
  }

  public remove(sprite: Sprite) {
    this.app.stage.removeChild(sprite)
  }

  public get width() {
    return this.app.screen.width
  }

  public get height() {
    return this.app.screen.height
  }

  public get pointer() {
    return this.app.renderer.events.pointer
  }

  public set sort(_: boolean) {
    this.app.stage.sortableChildren = true
  }

  private init() {
    this.app.ticker.add((delta) => {
      this.overScene.visible = this.player.dead
      this.startScene.visible = !this.started
      if (!this.started) return
      this.player.update(delta)
      this.zombies.forEach((zombie) => zombie.update(delta))
      this.bulletHitTest()
    })
  }

  private bulletHitTest() {
    this.player.shooting.bullets.forEach((bullet) => {
      this.zombies.forEach((zombie, index) => {
        const dx = zombie.x - bullet.x
        const dy = zombie.y - bullet.y
        const distance = Math.sqrt(dx ** 2 + dy ** 2)
        if (distance < bullet.radius + zombie.radius) {
          this.zombies.splice(index, 1)
          zombie.die()
        }
      })
    })
  }

  private createScene(text: string) {
    const sceneText = new PIXI.Text(text)
    sceneText.x = this.app.screen.width * 0.5
    sceneText.y = 0
    sceneText.anchor.set(0.5, 0)
    const sceneContainer = new PIXI.Container()
    sceneContainer.zIndex = 1
    sceneContainer.addChild(sceneText)
    this.app.stage.addChild(sceneContainer)
    return sceneContainer
  }

  private start = () => {
    this.started = true
  }
}
