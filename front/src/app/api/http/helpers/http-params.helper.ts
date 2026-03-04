import { HttpParams } from '@angular/common/http';

export function buildQueryParams(params: Record<string, string | null | undefined>): HttpParams {
  let httpParams = new HttpParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      httpParams = httpParams.set(key, value);
    }
  });

  return httpParams;
}
