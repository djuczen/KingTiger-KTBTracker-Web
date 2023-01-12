import { Instant } from "@js-joda/core";

export interface User {
    uid: string;
    displayName: string;
    fullName: string;
    givenName: string;
    email: string;
    emailVerified: boolean;
    disabled: boolean;
    customClaims: { [key: string]: any };
    tokensValidAfterTimestamp: Instant;
    createdAt: Instant;
    lastLoginAt: Instant;
    lastRefreshAt: Instant;
}
