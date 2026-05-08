import type { RuntimeEvent } from '../models/event.js'
import type { RuntimeState } from '../models/state.js'
import type { TenantModel } from '../models/tenant-model.js'
import { EventStore } from '../store/event-store.js'
import { StateStore } from '../store/state-store.js'
import { evaluate } from './evaluator.js'
import { execute, mapTransitionsToActions } from './executor.js'

export async function handleEvent(event: RuntimeEvent, tenantModel: TenantModel): Promise<void> {
  const defaultEntityType = tenantModel.entities[0]
  const defaultState = tenantModel.states[0]

  if (defaultEntityType === undefined || defaultState === undefined) {
    throw new Error('Tenant model must define at least one entity and one state')
  }

  const matchingTransitionsForEvent = tenantModel.transitions.filter(
    (transition) => transition.eventType === event.type
  )
  const inferredEntityType = matchingTransitionsForEvent[0]?.entityType ?? defaultEntityType
  const inferredState = matchingTransitionsForEvent[0]?.fromState ?? defaultState

  const currentState: RuntimeState =
    (await StateStore.get(event.entityId)) ?? {
      entityId: event.entityId,
      type: inferredEntityType,
      state: inferredState
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
