export type RuntimeEvent = {
  tenantId: string
  entityId: string
  type: string
  payload?: unknown
}
