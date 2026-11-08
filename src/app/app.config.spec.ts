import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';

describe('appConfig (S-E1-01, S-E1-03)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [...appConfig.providers] });
  });

  it('FR NFR-4 / ADR-04 : utilise le routage en mode hash (withHashLocation)', () => {
    const strategy = TestBed.inject(LocationStrategy);
    expect(strategy instanceof HashLocationStrategy).toBeTrue();
  });
});
