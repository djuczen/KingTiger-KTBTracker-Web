import { ValidatorFn, Validators } from "@angular/forms";

export interface RequirementConfig {
    title: string;
    description: string;
    units: string,
    validators: ValidatorFn[];
}

export const requirementsConfig: Map<string, RequirementConfig> = new Map([
    ["miles", {
        title: 'Distance Ran',
        description: '',
        units: 'a whole (or fractional) number of miles',
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")],
    }],
    ["pushUps", {
        title: 'Push Ups',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["sitUps", {
        title: 'Sit Ups',
        description: '',
        units: 'minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["burpees", {
        title: 'Burpees',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["kicks", {
        title: 'Kicks',
        description: 'Equal sets of front, back and side kicks',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["poomsae", {
        title: 'Poomsae',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["selfDefense", {
        title: 'Self-Defense',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["sparring", {
        title: 'Sparring',
        description: '',
        units: 'a whole (or fractional) number of minutes',
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }],
    ["jumps", {
        title: 'Jump Rope',
        description: '',
        units: 'a whole (or fractional) number of minutes',
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }],
    ["pullUps", {
        title: 'Pull Ups',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["planks", {
        title: 'Planks',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["rollsFalls", {
        title: 'Rolls & Falls',
        description: '',
        units: 'a whole number of minutes',
        validators: [Validators.pattern("^[0-9]+$")]
    }
    ],
    ["classSaturday", {
        title: 'Saturday',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classWeekday", {
        title: 'Weekday',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classPMAA", {
        title: 'PMAA',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classSparring", {
        title: 'Olympic Sparring',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classMasterQ", {
        title: 'MasterQuest',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classDreamTeam", {
        title: 'DreamTeam',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["classHyperPro", {
        title: 'HyperPro',
        description: '',
        units: 'classes',
        validators: []
    }
    ],
    ["meditation", {
        title: 'Meditation',
        description: '',
        units: 'minutes',
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }
    ],
    ["randomActs", {
        title: 'RAOK',
        units: 'acts',
        description: 'Random Acts of Kindess (RAOK)',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["mentor", {
        title: 'Mentor',
        description: '',
        units: 'minutes',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["mentee", {
        title: 'Be Mentored',
        description: '',
        units: 'minutes',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["leadership", {
        title: 'Lead',
        description: '',
        units: 'classes',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["leadership2", {
        title: 'Assist',
        description: '',
        units: 'classes',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["journals", {
        title: 'Journals',
        description: '',
        units: 'entries',
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
]);

export interface Requirements {
    miles: number;
    pushUps: number;
    sitUps: number;
    burpees: number;
    kicks: number;
    poomsae: number;
    selfDefense: number;
    sparring: number;
    jumps: number;
    pullUps: number;
    planks: number;
    rollsFalls: number;
    //
    classSaturday: number;
    classWeekday: number;
    classPMAA: number;
    classSparring: number;
    classMasterQ: number;
    classDreamTeam: number;
    classHyperPro: number;
    //
    meditation: number;
    randomActs: number;
    mentor: number;
    mentee: number;
    leadership: number;
    leadership2: number;
}
