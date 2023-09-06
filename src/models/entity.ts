import type { Game, Sprite } from '@/types'

export default abstract class Entity {
  public game
  public radius
  public abstract sprite: Sprite

  constructor(game: Game) {
    this.game = game
    this.radius = 0
  }

  public abstract update(delta: number): void
  public attack = () => {}
  public die = () => {}

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
