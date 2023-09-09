import type { Sprite, Graphics, IApplicationOptions } from '@/types'
import { Application, Assets, Container, Text, BaseTexture, SCALE_MODES } from 'pixi.js'
import { Player, Spawner, Zombie } from '@/models'

export const assets = <const>['cop', 'dog', 'female', 'nurse', 'quick', 'tank', 'hero', 'bullet']

export default class Game {
  private app
  private player
  private zombies
  private startScene
  private endScene
  public zombieNames
  public started

  /** @private */
  private constructor() {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

    const view = document.querySelector('canvas')!
    const size = 400
    const backgroundColor = 0x312a2b
    const resolution = 2
    const options: Partial<IApplicationOptions> = { view, width: size, height: size, backgroundColor, resolution }
    this.app = new Application(options)

    this.started = false
    this.startScene = this.createScene('Click to Start')
    this.endScene = this.createScene('Game Over')

    this.player = new Player(this)
    this.zombieNames = assets.filter((asset) => asset !== 'hero' && asset !== 'bullet')
    this.zombies = new Spawner(this, () => new Zombie(this, this.player)).spawns

    this.app.ticker.add((delta) => {
      this.endScene.visible = this.player.dead
      this.startScene.visible = !this.started
      if (this.started) {
        this.player.update(delta)
        this.zombies.forEach((zombie) => zombie.update(delta))
        this.bulletHitTest()
      }
    })

    document.addEventListener('click', () => void (this.started = true))
  }

  public static async initialize() {
    try {
      assets.forEach((asset) => {
        const resource = asset !== 'hero' && asset !== 'bullet' ? asset + 'zee' : asset
        const extension = asset === 'bullet' ? '.png' : '.json'
        Assets.add(asset, `assets/${resource + extension}`)
      })
      await Assets.load([...assets])
      return new Game()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public add(obj: Sprite | Graphics) {
    this.app.stage.addChild(obj)
  }

  public remove(obj: Sprite | Graphics) {
    this.app.stage.removeChild(obj)
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

  public set sort(value: boolean) {
    this.app.stage.sortableChildren = value
  }

  private bulletHitTest() {
    this.player.shooting.bullets.forEach((bullet) => {
      this.zombies.forEach((zombie, index) => {
        const dx = zombie.x - bullet.x
        const dy = zombie.y - bullet.y
        const distance = Math.hypot(dx, dy)
        if (distance < bullet.radius + zombie.radius) {
          this.zombies.splice(index, 1)
          zombie.die()
        }
      })
    })
  }

  private createScene(text: string) {
    const sceneText = new Text(text)
    sceneText.x = this.app.screen.width * 0.5
    sceneText.y = 0
    sceneText.anchor.set(0.5, 0)
    const sceneContainer = new Container()
    sceneContainer.zIndex = 1
    sceneContainer.addChild(sceneText)
    this.app.stage.addChild(sceneContainer)
    return sceneContainer
  }
}
