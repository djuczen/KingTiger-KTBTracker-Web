export interface IStatistics {
    overall: number;
    //
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
};

export class Statistics implements IStatistics {
    overall: number;
    //
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

    constructor(statistics?: IStatistics) {
        this.overall = statistics?.overall || 0;
        this.miles = statistics?.miles || 0;
        this.pushUps = statistics?.pushUps || 0;
        this.sitUps = statistics?.sitUps || 0;
        this.burpees = statistics?.burpees || 0;
        this.kicks = statistics?.kicks || 0;
        this.poomsae = statistics?.poomsae || 0;
        this.selfDefense = statistics?.selfDefense || 0;
        this.sparring = statistics?.sparring || 0;
        this.jumps = statistics?.jumps || 0;
        this.pullUps = statistics?.pullUps || 0;
        this.planks = statistics?.planks || 0;
        this.rollsFalls = statistics?.rollsFalls || 0;
        this.classSaturday = statistics?.classSaturday || 0;
        this.classWeekday = statistics?.classWeekday || 0;
        this.classPMAA = statistics?.classPMAA || 0;
        this.classSparring = statistics?.classSparring || 0;
        this.classMasterQ = statistics?.classMasterQ || 0;
        this.classDreamTeam = statistics?.classDreamTeam || 0;
        this.classHyperPro = statistics?.classHyperPro || 0;
        this.meditation = statistics?.meditation || 0;
        this.randomActs = statistics?.randomActs || 0;
        this.mentor = statistics?.mentor || 0;
        this.mentee = statistics?.mentee || 0;
        this.leadership = statistics?.leadership || 0;
        this.leadership2= statistics?.leadership2 || 0;
    }
}
