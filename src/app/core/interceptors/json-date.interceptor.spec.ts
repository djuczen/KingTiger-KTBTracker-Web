import { TestBed } from '@angular/core/testing';

import { JsonDateInterceptor } from './json-date.interceptor';

describe('JsonDateInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JsonDateInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JsonDateInterceptor = TestBed.inject(JsonDateInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
