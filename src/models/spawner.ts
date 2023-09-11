import type { Game, Zombie } from '@/types'
import State from '@/state'

export default class Spawner {
  private game
  private create
  private maxSpawns
  private spawnInterval
  public spawns: Zombie[]

  constructor(game: Game, create: () => Zombie) {
    this.game = game
    this.create = create
    this.maxSpawns = 10
    this.spawnInterval = 1_000
    this.spawns = []
    setInterval(this.spawn, this.spawnInterval)
  }

  private spawn = () => {
    if (this.game.state !== State.Running) return
    if (this.spawns.length >= this.maxSpawns) return
    const zombie = this.create()
    this.spawns.push(zombie)
  }
}
