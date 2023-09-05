import type * as PIXI from 'pixi.js'

export default abstract class Entity {
  protected app
  protected abstract sprite: PIXI.Sprite | PIXI.Graphics

  constructor(app: PIXI.Application) {
    this.app = app
  }

  public update() {}
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
