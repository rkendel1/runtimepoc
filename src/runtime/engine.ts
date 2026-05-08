import type { RuntimeEvent } from '../models/event.js'
import type { RuntimeState } from '../models/state.js'
import type { TenantModel } from '../models/tenant-model.js'
import { EventStore } from '../store/event-store.js'
import { StateStore } from '../store/state-store.js'
import { evaluate } from './evaluator.js'
import { execute, mapTransitionsToActions } from './executor.js'

export async function handleEvent(event: RuntimeEvent, tenantModel: TenantModel): Promise<void> {
  const currentState: RuntimeState =
    (await StateStore.get(event.entityId)) ?? {
      entityId: event.entityId,
      type: tenantModel.entities[0],
      state: tenantModel.states[0]
    }

  const transitions = evaluate(tenantModel, event, currentState)

  for (const transition of transitions) {
    const actions = mapTransitionsToActions([transition], tenantModel, event)
    const results = await execute(actions)

    await StateStore.update(event.entityId, transition.toState, transition.entityType)

    const followUpEvents: RuntimeEvent[] = results.followUpEvents.map((followUpEvent) => ({
      tenantId: event.tenantId,
      entityId: event.entityId,
      type: followUpEvent.type,
      payload: followUpEvent.payload ?? {}
    }))

    await EventStore.emit(followUpEvents)

    for (const followUpEvent of followUpEvents) {
      await handleEvent(followUpEvent, tenantModel)
    }
  }
}
