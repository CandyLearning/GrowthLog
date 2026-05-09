import type { RequestHandler } from 'msw'
// Worker adds per-resource handler imports here:
import { authHandlers } from './auth'
import { usersHandlers } from './users'
import { goalHandlers } from './goal'
import { recordHandlers } from './record'
import { moodHandlers } from './mood'
import { gratitudeHandlers } from './gratitude'
import { petHandlers } from './pet'

export const handlers: RequestHandler[] = [
  // Worker adds handler spreads here:
  ...authHandlers,
  ...usersHandlers,
  ...goalHandlers,
  ...recordHandlers,
  ...moodHandlers,
  ...gratitudeHandlers,
  ...petHandlers,
]
