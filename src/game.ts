import type { DisplayObject } from '@/types'
import { Application, Assets, Container, Text, TextStyle, BaseTexture, SCALE_MODES } from 'pixi.js'
import { Player, Spawner, Zombie, Weather } from '@/models'
import { textStyle, subTextStyle } from '@/styles'
import { all, zombies } from '@/assets'
import State from '@/state'

export default class Game {
  private app
  public state
  public player
  private size
  private weather
  private zombies
  private preIntroScene
  private startScene
  private overScene
  private music
  private horde
  public zombieNames

  /** @private */
  private constructor() {
    BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
    this.state = State.PreIntro
    this.size = 400
    this.zombieNames = zombies

    this.music = new Audio('assets/hordezee.mp3')
    this.music.volume = 0.5
    this.horde = new Audio('assets/horde.mp3')
    this.horde.volume = 0.5

    this.app = new Application({
      view: document.querySelector('canvas')!,
      width: this.size,
      height: this.size,
      backgroundColor: 0x312a2b,
      resolution: 2,
    })

    this.preIntroScene = this.createScene('HordeZee', 'Click to Continue')
    this.startScene = this.createScene('HordeZee', 'Click to Start')
    this.overScene = this.createScene('HordeZee', 'Game Over')

    this.player = new Player(this)
    this.weather = new Weather(this)
    this.zombies = new Spawner(this, () => new Zombie(this)).spawns

    this.mainLoop()
    this.setListeners()
  }

  public static async initialize() {
    try {
      all.forEach((asset) => {
        const resource = asset !== 'hero' && asset !== 'bullet' && asset !== 'rain' ? asset + 'zee' : asset
        const extension = asset === 'bullet' || asset === 'rain' ? '.png' : '.json'
        Assets.add(asset, `assets/${resource + extension}`)
      })

      await Assets.load([...all])
      return new Game()
    } catch (error) {
      if (import.meta.env.DEV) console.log(error)
      return null
    }
  }

  private mainLoop() {
    this.app.ticker.add((delta) => {
      if (this.player.dead) this.state = State.Over
      this.preIntroScene.visible = this.state === State.PreIntro
      this.startScene.visible = this.state === State.Start
      this.overScene.visible = this.state === State.Over

      switch (this.state) {
        case State.PreIntro:
          this.player.scale = 4
          break
        case State.Intro:
          this.player.scale -= 0.01
          if (this.player.scale <= 1) this.state = State.Start
          break
        case State.Running:
          this.player.update(delta)
          this.zombies.forEach((zombie) => zombie.update(delta))
          this.bulletHitTest()
          break
      }
    })
  }

  private setListeners() {
    this.music.addEventListener('timeupdate', function () {
      if (this.currentTime > this.duration - 0.2) this.currentTime = 0
    })

    this.horde.addEventListener('timeupdate', function () {
      if (this.currentTime > this.duration - 0.2) this.currentTime = 0
    })

    document.addEventListener('click', () => {
      switch (this.state) {
        case State.PreIntro:
          this.state = State.Intro
          this.weather.enableSound()
          this.music.play()
          break
        case State.Start:
          this.state = State.Running
          this.horde.play()
          break
      }
    })
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

  private createScene(_text: string, _subText: string) {
    const text = new Text(_text, new TextStyle(textStyle))
    text.x = this.width * 0.5
    text.y = 0
    text.anchor.set(0.5, 0)
    const subText = new Text(_subText, new TextStyle(subTextStyle))
    subText.x = this.width * 0.5
    subText.y = 50
    subText.anchor.set(0.5, 0)
    const container = new Container()
    container.zIndex = 1
    container.addChild(text)
    container.addChild(subText)
    this.add(container)
    return container
  }
}
