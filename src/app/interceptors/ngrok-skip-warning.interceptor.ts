import { HttpInterceptorFn } from '@angular/common/http';

export const ngrokSkipWarningInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({
    setHeaders: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  return next(modifiedReq);
};
