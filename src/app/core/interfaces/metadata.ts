import { LocalDateTime } from "@js-joda/core";

export interface Metadata {
    created: LocalDateTime;
    createdBy: string;
    modified: LocalDateTime;
    modifiedBy: string;
}
