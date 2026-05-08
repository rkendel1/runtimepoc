import assert from 'node:assert/strict'
import { beforeEach, describe, it } from 'node:test'
import { handleEvent } from '../runtime/engine.js'
import { AdapterRegistry } from '../runtime/dispatcher.js'
import { StateStore } from '../store/state-store.js'
import { EventStore } from '../store/event-store.js'
import { demoTenantModel } from '../tenants/demo-tenant.js'

describe('Runtime Engine', () => {
  beforeEach(() => {
    StateStore.reset()
    EventStore.reset()
    AdapterRegistry.resetToDefaults()
  })

  it('executes full tenant operational loop', async () => {
    const event = {
      type: 'document.uploaded',
      entityId: 'doc_1',
      tenantId: 't1',
      payload: {}
    }

    await handleEvent(event, demoTenantModel)

    const state = await StateStore.get('doc_1')

    assert.equal(state?.state, 'signed')
  })
})
