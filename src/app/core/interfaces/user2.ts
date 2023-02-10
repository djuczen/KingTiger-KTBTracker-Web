import { Instant } from "@js-joda/core";

export interface User2 {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    disabled: boolean;
    customClaims?: { [key: string]: any };
    tokensValidAfterTimestamp?: Instant;
    createdAt?: Instant;
    lastLoginAt?: Instant;
    lastRefreshAt?: Instant;
    fullName?: string;
    sortedName?: string;
    givenName?: string;
}
