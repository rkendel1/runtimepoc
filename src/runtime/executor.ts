import type { RuntimeAction } from '../models/action.js'
import type { RuntimeEvent } from '../models/event.js'
import type { TenantModel, Transition } from '../models/tenant-model.js'
import { AdapterRegistry } from './dispatcher.js'

export type ExecuteResult = {
  followUpEvents: Array<{ type: string; payload?: unknown }>
}

export function mapTransitionsToActions(
  transitions: Transition[],
  model: TenantModel,
  event: RuntimeEvent
): RuntimeAction[] {
  const actions: RuntimeAction[] = []

  for (const transition of transitions) {
    for (const actionName of transition.actions) {
      const actionDefinition = model.actions.find((action) => action.name === actionName)

      if (!actionDefinition) {
        throw new Error(`Action definition not found for: ${actionName}`)
      }

      actions.push({
        ...actionDefinition,
        tenantId: event.tenantId,
        entityId: event.entityId,
        eventType: event.type,
        payload: event.payload ?? {}
      })
    }
  }

  return actions
}

export async function execute(actions: RuntimeAction[]): Promise<ExecuteResult> {
  const followUpEvents: Array<{ type: string; payload?: unknown }> = []

  for (const action of actions) {
    const adapter = AdapterRegistry.get(action.provider)
    const result = await adapter.execute(action)

    if (result.followUpEvents) {
      followUpEvents.push(...result.followUpEvents)
    }
  }

  return { followUpEvents }
}
