import type { RuntimeEvent } from '../models/event.js'
import type { RuntimeState } from '../models/state.js'
import type { TenantModel, Transition } from '../models/tenant-model.js'

export function evaluate(model: TenantModel, event: RuntimeEvent, state: RuntimeState): Transition[] {
  return model.transitions.filter((transition) =>
    transition.eventType === event.type &&
    transition.fromState === state.state &&
    transition.entityType === state.type
  )
}
