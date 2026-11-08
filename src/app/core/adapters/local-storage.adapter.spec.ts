import { LocalStorageAdapter } from './local-storage.adapter';

// S-E2-03 critères 4 et 5 : erreurs du stockage navigateur converties en résultats, jamais en exceptions.
class FakeStorage {
  readonly data = new Map<string, string>();
  quotaExceeded = false;
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    if (this.quotaExceeded) throw new DOMException('quota', 'QuotaExceededError');
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe('LocalStorageAdapter (S-E2-03)', () => {
  it('lit et écrit une valeur', () => {
    const adapter = new LocalStorageAdapter(() => new FakeStorage() as unknown as Storage);
    expect(adapter.write('k', 'v')).toEqual({ ok: true, value: undefined });
    expect(adapter.read('k')).toEqual({ ok: true, value: null });
  });

  it('critère 4 : QuotaExceededError renvoie STORAGE_QUOTA sans lever d\'exception', () => {
    const fake = new FakeStorage();
    fake.quotaExceeded = true;
    const adapter = new LocalStorageAdapter(() => fake as unknown as Storage);
    expect(adapter.write('k', 'v')).toEqual({ ok: false, error: 'STORAGE_QUOTA' });
  });

  it('critère 5 : SecurityError à l\'accès renvoie STORAGE_UNAVAILABLE sans lever d\'exception', () => {
    const adapter = new LocalStorageAdapter(() => {
      throw new DOMException('denied', 'SecurityError');
    });
    expect(adapter.read('k')).toEqual({ ok: false, error: 'STORAGE_UNAVAILABLE' });
    expect(adapter.write('k', 'v')).toEqual({ ok: false, error: 'STORAGE_UNAVAILABLE' });
    expect(adapter.remove('k')).toEqual({ ok: false, error: 'STORAGE_UNAVAILABLE' });
  });
});
