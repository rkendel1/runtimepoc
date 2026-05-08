export type ActionDefinition = {
  name: string
  provider: string
}

export type RuntimeAction = ActionDefinition & {
  tenantId: string
  entityId: string
  eventType: string
  payload: unknown
}
