export type * from 'pixi.js'
export type * from '@/models'
export type { default as Game } from '@/game'
export type Name = '' | (typeof import('@/game').characters)[number]
