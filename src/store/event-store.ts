import type { RuntimeEvent } from '../models/event.js'

export class EventStore {
  private static readonly events: RuntimeEvent[] = []

  static async emit(events: RuntimeEvent[]): Promise<void> {
    this.events.push(...events)
  }

  static getAllEvents(): RuntimeEvent[] {
    return [...this.events]
  }

  static reset(): void {
    this.events.length = 0
  }
}
