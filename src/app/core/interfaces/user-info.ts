import { ProviderUserInfo } from "./provider-user-info";

export interface UserInfo {
    localId: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    passwordHash: string;
    passwordUpdatedAt: number;
    providerUserInfo: ProviderUserInfo[];
    validSince: number;
    lastLoginAt: number;
    lastRefreshAt: number;
}
