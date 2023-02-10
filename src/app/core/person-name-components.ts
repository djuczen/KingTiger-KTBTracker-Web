import { Inject, LOCALE_ID } from "@angular/core";
import { NGXLogger } from "ngx-logger";

const prefixes = ['mr', 'mrs', 'ms', 'miss', 'dr', 'hon', 'mayor', 'president', 'pres', 'master', 'grandmaster'];

const suffixes = ['jr', 'sr', 'iii', 'iv', 'phd', 'md', 'dds', 'od', 'ret'];

export class PersonNameComponents {

    personName: string | undefined;

    namePrefix?: string;

    givenName?: string;

    middleName?: string;

    familyName?: string;

    nameSuffix?: string;

    nickname?: string;

    phoneticRepresentation?: string;

    constructor( name?: string, @Inject(LOCALE_ID) private locale?: string) {
        this.personName = name || '';

        let components: string[] = this.personName.replace(',', '').split(/\s+/);

        //
        // If the number of components is 3 or more, it _may_ have a suffix or prefix...
        //
        if (components.length > 2) {
            // If the first component matches a known prefix, extract it and remove it
            if (components.length > 1 && prefixes.includes(components[0].replace('.', '').toLowerCase())) {
                this.namePrefix = components[0];
                components = components.slice(1);
            }

            // If the last component matches a known suffix, extract it and remove it
            if (components.length > 1 && suffixes.includes(components.slice(-1)[0].replace('.', '').toLowerCase())) {
                this.nameSuffix = components.slice(-1)[0];
                components = components.slice(0, -1);
            }
        }

        if (components.length > 2) {
            this.givenName = components[0];
            this.familyName = components.slice(-1)[0];
            this.middleName = components.slice(1, -1).join(' ');
        } else {
            if (components.length > 1) {
                this.givenName = components[0];
                this.familyName = components[1];
            } else {
                this.givenName = components[0];
            }
        }
    }

    get fullName(): string {
        return [this.namePrefix, this.givenName, this.middleName, this.familyName, this.nameSuffix].join(' ');
    }

    public toString(): string {
        return this.fullName;
    }
}
