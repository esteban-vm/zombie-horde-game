import type { Game } from '@/types'
import { Sprite, Texture, ParticleContainer } from 'pixi.js'
import { Emitter, upgradeConfig } from '@pixi/particle-emitter'
import { rain } from '@/emitter.config'

export default class Weather {
  public game
  private lightning
  private lightningGap
  private playing
  private container
  private elapsed
  private emitter
  private rain!: HTMLAudioElement
  private thunder!: HTMLAudioElement

  constructor(game: Game) {
    this.game = game
    this.lightning = new Sprite(Texture.WHITE)
    this.lightning.width = this.lightning.height = this.game.width
    this.lightning.tint = 0xffffff
    this.lightning.alpha = 0.8
    this.lightningGap = { min: 9_000, max: 29_000 }
    this.playing = false
    this.container = new ParticleContainer()
    this.container.zIndex = 2
    this.game.add(this.container)
    this.elapsed = Date.now()
    this.emitter = new Emitter(this.container, upgradeConfig(rain, Texture.from('rain')))
    this.emitter.emit = true
    this.updateParticles()
    this.createAudio()
    this.flash()
  }

  private updateParticles = () => {
    requestAnimationFrame(this.updateParticles)
    const now = Date.now()
    this.emitter.update((now - this.elapsed) * 0.001)
    this.elapsed = now
  }

  private createAudio() {
    this.rain = new Audio('assets/rain.mp3')
    this.thunder = new Audio('assets/thunder.mp3')
    this.rain.volume = 0.5
    this.thunder.volume = 0.5
    this.rain.addEventListener('timeupdate', function () {
      if (this.currentTime > this.duration) this.currentTime = 0
    })
  }

  private async flash() {
    await new Promise((resolve) => {
      const { min, max } = this.lightningGap
      setTimeout(resolve, min + (max - min) * Math.random())
    })
    this.game.add(this.lightning)
    if (this.playing) this.thunder.play()
    await new Promise((resolve) => setTimeout(resolve, 200))
    this.game.remove(this.lightning)
    this.flash()
  }

  public enableSound() {
    this.playing = true
    this.rain.play()
  }
}
