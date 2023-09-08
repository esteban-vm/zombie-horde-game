import type { Game, Name, Sprite, Graphics, Spritesheet, AnimatedSprite } from '@/types'

export abstract class Entity {
  protected game
  protected abstract sprite: Sprite | Graphics
  public radius
  public name: Name

  protected constructor(game: Game) {
    this.game = game
    this.radius = 0
    this.name = ''
  }

  public get x() {
    return this.sprite.position.x
  }

  public set x(value: number) {
    this.sprite.position.x = value
  }

  public get y() {
    return this.sprite.position.y
  }

  public set y(value: number) {
    this.sprite.position.y = value
  }

  public get width() {
    return this.sprite.width
  }

  public set width(value: number) {
    this.sprite.width = value
  }

  public get height() {
    return this.sprite.height
  }

  public set height(value: number) {
    this.sprite.height = value
  }

  public get rotation() {
    return this.sprite.rotation
  }

  public set rotation(value: number) {
    this.sprite.rotation = value
  }
}

export abstract class AnimatedEntity extends Entity {
  protected animations: AnimatedSprite[]
  protected abstract sprite: AnimatedSprite
  protected abstract spritesheet: Spritesheet

  protected constructor(game: Game) {
    super(game)
    this.animations = []
  }

  protected abstract load(): Promise<void>
  protected abstract update(delta: number): void
  protected attack = () => {}
  protected die = () => {}
}
