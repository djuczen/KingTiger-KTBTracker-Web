import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthTokenInterceptor } from "./auth-token.interceptor";

import { JsonInterceptor } from "./json.interceptor";
import { LoggingInterceptor } from "./logging.interceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JsonInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
];
