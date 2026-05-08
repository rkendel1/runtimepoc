import type { RuntimeAction } from '../models/action.js'

export type AdapterResult = {
  success: boolean
  followUpEvents?: Array<{
    type: string
    payload?: unknown
  }>
}

export interface Adapter {
  execute(action: RuntimeAction): Promise<AdapterResult>
}
