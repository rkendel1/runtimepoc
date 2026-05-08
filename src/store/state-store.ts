import type { RuntimeState } from '../models/state.js'

export class StateStore {
  private static readonly states = new Map<string, RuntimeState>()

  static async get(entityId: string): Promise<RuntimeState | undefined> {
    return this.states.get(entityId)
  }

  static async update(entityId: string, state: string, type: string): Promise<void> {
    this.states.set(entityId, { entityId, state, type })
  }

  static reset(): void {
    this.states.clear()
  }
}
