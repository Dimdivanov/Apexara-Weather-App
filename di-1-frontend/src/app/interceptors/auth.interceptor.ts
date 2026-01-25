import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const shouldIncludeCredentials =
    request.url.includes('/api/auth') || request.url.includes('/api/user');

  const cloned = shouldIncludeCredentials
    ? request.clone({ withCredentials: true })
    : request;

  return next(cloned);
};
