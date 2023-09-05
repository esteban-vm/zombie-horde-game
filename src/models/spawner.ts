import type Entity from '@/entity'

export default class Spawner {
  private create
  private maxSpawns
  private spawnInterval
  public spawns: Entity[]

  constructor(create: () => Entity) {
    this.create = create
    this.maxSpawns = 10
    this.spawnInterval = 1_000
    this.spawns = []
    setInterval(this.spawn, this.spawnInterval)
  }

  private spawn = () => {
    if (this.spawns.length >= this.maxSpawns) return
    const entity = this.create()
    this.spawns.push(entity)
  }
}
