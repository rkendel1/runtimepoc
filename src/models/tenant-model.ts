import type { ActionDefinition } from './action.js'

export type Transition = {
  entityType: string
  fromState: string
  eventType: string
  toState: string
  actions: string[]
}

export type TenantModel = {
  entities: string[]
  states: string[]
  events: string[]
  transitions: Transition[]
  actions: ActionDefinition[]
}
