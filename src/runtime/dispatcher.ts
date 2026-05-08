import { DocuSealAdapter } from '../adapters/docuseal.js'
import { MockAdapter } from '../adapters/mock.js'
import type { Adapter } from '../adapters/base.js'

export class AdapterRegistry {
  private static readonly adapters = new Map<string, Adapter>()

  static register(provider: string, adapter: Adapter): void {
    this.adapters.set(provider, adapter)
  }

  static get(provider: string): Adapter {
    const adapter = this.adapters.get(provider)

    if (!adapter) {
      throw new Error(`No adapter registered for provider: ${provider}`)
    }

    return adapter
  }

  static resetToDefaults(): void {
    this.adapters.clear()
    this.register('docuseal', new DocuSealAdapter())
    this.register('mock', new MockAdapter())
  }
}

AdapterRegistry.resetToDefaults()
