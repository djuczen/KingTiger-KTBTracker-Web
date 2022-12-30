import { ValidatorFn, Validators } from "@angular/forms";
import * as _ from "underscore";

export interface RequirementConfig {
    label: string;
    title: string;
    description: string;
    default: number;
    units: string,
    fractional: boolean;
    reducable: boolean;
    carriable: boolean;
    validators: ValidatorFn[];
}

const physicalRequirements: Map<string, RequirementConfig> = new Map([
    ["miles", {
        label: 'Run',
        title: 'Distance Ran',
        description: '',
        default: 103,
        units: 'miles',
        fractional: true,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("([0-9]+[.])?[0-9]+")],
    }],
    ["pushUps", {
        label: 'Push-Ups',
        title: 'Push Ups',
        description: '',
        default: 350,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["sitUps", {
        label: 'Sit-Ups',
        title: 'Sit Ups',
        description: '',
        default: 350,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["burpees", {
        label: 'Burpees',
        title: 'Burpees',
        description: '',
        default: 350,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["kicks", {
        label: 'Kicks (Front/Back/Side)',
        title: 'Kicks',
        description: 'Equal sets of front, back and side kicks',
        default: 832,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["poomsae", {
        label: 'Poomsae',
        title: 'Poomsae',
        description: '',
        default: 1512,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["selfDefense", {
        label: 'Self-Defense',
        title: 'Self-Defense',
        description: '',
        default: 1512,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["sparring", {
        label: 'Sparring',
        title: 'Sparring',
        description: '',
        default: 0,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }],
    ["jumps", {
        label: 'Jump Rope',
        title: 'Jump Rope',
        description: '',
        default: 350,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }],
    ["pullUps", {
        label: 'Pull-Ups',
        title: 'Pull Ups',
        description: '',
        default: 83,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["planks", {
        label: 'Planks',
        title: 'Planks',
        description: '',
        default: 83,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }],
    ["rollsFalls", {
        label: 'Rolls & falls',
        title: 'Rolls & Falls',
        description: '',
        default: 340,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("^[0-9]+$")]
    }
    ]
]);

const classRequirements: Map<string, RequirementConfig> = new Map([
    ["classSaturday", {
        label: 'Saturday Black Belt Classes',
        title: 'Saturday',
        description: '',
        default: 12,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classWeekday", {
        label: 'Weekday Black Belt Classes',
        title: 'Weekday',
        description: '',
        default: 12,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classPMAA", {
        label: 'Philippine Matial Arts Alliance (PMAA) Classes',
        title: 'PMAA',
        description: '',
        default: 0,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classSparring", {
        label: 'Sparring Classes',
        title: 'Olympic Sparring',
        description: '',
        default: 12,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classMasterQ", {
        label: 'MasterQuest Classes',
        title: 'MasterQuest',
        description: '',
        default: 0,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classDreamTeam", {
        label: 'DreamTeam Classes',
        title: 'DreamTeam',
        description: '',
        default: 0,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ],
    ["classHyperPro", {
        label: 'HyperPro Classes',
        title: 'HyperPro',
        description: '',
        default: 0,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: []
    }
    ]
]);

const otherRequirements: Map<string, RequirementConfig> = new Map([
    ["meditation", {
        label: 'Meditation',
        title: 'Meditation',
        description: '',
        default: 0,
        units: 'minutes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]*(\.[0-9]+)?")]
    }
    ],
    ["randomActs", {
        label: 'Random Acts of Kindness (RAOK)',
        title: 'RAOK',
        description: '',
        default: 0,
        units: 'individual intentional acts',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["mentor", {
        label: 'Mentor Meetings',
        title: 'Mentor',
        description: 'You must meet with someone that is a higher belt, non-family member, and who will be responsible for guiding you through the cycle. Can only count one session a day, no matter how long it is.',
        default: 15,
        units: 'sessions (15 minutes minimum)',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["mentee", {
        label: 'Mentee Meetings',
        title: 'Be Mentored',
        description: 'You must meet with someone that is a lower belt, non-family member, and who you will be responsible for helping them get ready for their next test. Can only count one session a day, no matter how long it is.',
        default: 15,
        units: 'sessions (15 minutes minimum)',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["leadership", {
        label: 'Class Assistance',
        title: 'Lead',
        description: 'Helping your Instructors in class. (e.g. break-ing out with one or more students for prac-tice, holding paddles, helping correct tech-nique, classroom control)',
        default: 20,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["leadership2", {
        label: 'Leadership Credit',
        title: 'Assist',
        description: 'Leading class activities. (e.g. opening class, warm-ups, kicking, etc.)',
        default: 10,
        units: 'classes',
        fractional: false,
        reducable: false,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ],
    ["journals", {
        label: 'Daily Journals',
        title: 'Journals',
        description: 'only one entry will be counted per day',
        default: 50,
        units: 'entries',
        fractional: false,
        reducable: true,
        carriable: true,
        validators: [Validators.pattern("[0-9]+")]
    }
    ]
]);


export class RequirementsConfiguration {

    public static get all(): Map<string, RequirementConfig> {
        return new Map<string, RequirementConfig>([...physicalRequirements, ...classRequirements, ...otherRequirements]);
    }

    public static get physical(): Map<string, RequirementConfig> {
        return physicalRequirements;
    }

    public static get classes(): Map<string, RequirementConfig> {
        return classRequirements;
    }

    public static get other(): Map<string, RequirementConfig> {
        return otherRequirements;
    }
}
