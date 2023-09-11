import type { ITextStyle } from '@/types'

export const textStyle: Partial<ITextStyle> = {
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'normal',
  fontWeight: 'bold',
  fill: ['#88A050', '#ff0000'],
  stroke: '#F0E8C8',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: '#000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
}

export const subTextStyle: typeof textStyle = {
  fontFamily: 'Arial',
  fontSize: 22,
  fontStyle: 'normal',
  fontWeight: 'bold',
  fill: ['#88A050'],
  stroke: '#000',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
}
