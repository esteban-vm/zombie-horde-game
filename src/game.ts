import type { DisplayObject } from '@/types'
import { Application, Assets, Container, Text, BaseTexture, SCALE_MODES } from 'pixi.js'
import { Player, Spawner, Zombie, Weather } from '@/models'

export const zombies = <const>['cop', 'dog', 'female', 'nurse', 'quick', 'tank']
export const assets = <const>[...zombies, 'hero', 'bullet', 'rain']

export default class Game {
  private app
  public player
  private weather
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
    this.app = new Application({ view, width: size, height: size, backgroundColor, resolution })

    this.started = false
    this.startScene = this.createScene('Click to Start')
    this.endScene = this.createScene('Game Over')
    this.zombieNames = zombies

    this.player = new Player(this)
    this.weather = new Weather(this)
    this.zombies = new Spawner(this, () => new Zombie(this)).spawns

    this.app.ticker.add((delta) => {
      this.endScene.visible = this.player.dead
      this.startScene.visible = !this.started
      if (this.started) {
        this.player.update(delta)
        this.zombies.forEach((zombie) => zombie.update(delta))
        this.bulletHitTest()
      }
    })

    document.addEventListener('click', this.start)
  }

  public static async initialize() {
    try {
      assets.forEach((asset) => {
        const resource = asset !== 'hero' && asset !== 'bullet' && asset !== 'rain' ? asset + 'zee' : asset
        const extension = asset === 'bullet' || asset === 'rain' ? '.png' : '.json'
        Assets.add(asset, `assets/${resource + extension}`)
      })

      await Assets.load([...assets])
      return new Game()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public add(obj: DisplayObject) {
    this.app.stage.addChild(obj)
  }

  public remove(obj: DisplayObject) {
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
          zombie.kill()
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

  private start = () => {
    this.started = true
    this.weather.enableSound()
  }
}
