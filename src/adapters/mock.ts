import type { RuntimeAction } from '../models/action.js'
import type { Adapter, AdapterResult } from './base.js'

export class MockAdapter implements Adapter {
  async execute(_action: RuntimeAction): Promise<AdapterResult> {
    return {
      success: true,
      followUpEvents: []
    }
  }
}
