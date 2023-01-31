export interface IPhysicalExam {
    preExamRun: number;
    preExamPushUps: number;
    preExamSitUps: number;
    preExamBurpees: number;
    preExamPullUps: number;
    preExamPlanks: number;

    examRun: number;
    examPushUps: number;
    examSitUps: number;
    examBurpees: number;
    examPullUps: number;
    examPlanks: number;
}

export class PhysicalExam implements IPhysicalExam {

    preExamRun: number;
    preExamPushUps: number;
    preExamSitUps: number;
    preExamBurpees: number;
    preExamPullUps: number;
    preExamPlanks: number;

    examRun: number;
    examPushUps: number;
    examSitUps: number;
    examBurpees: number;
    examPullUps: number;
    examPlanks: number;

    constructor(physicalExam?: IPhysicalExam) {
        if (physicalExam) {
            this.preExamRun = physicalExam.preExamRun;
            this.preExamPushUps = physicalExam.preExamPushUps;
            this.preExamSitUps = physicalExam.preExamSitUps;
            this.preExamBurpees = physicalExam.preExamBurpees;
            this.preExamPullUps = physicalExam.preExamPullUps;
            this.preExamPlanks = physicalExam.preExamPlanks;
            this.examRun = physicalExam.examRun;
            this.examPushUps = physicalExam.examPushUps;
            this.examSitUps = physicalExam.examSitUps;
            this.examBurpees = physicalExam.examBurpees;
            this.examPullUps = physicalExam.examPullUps;
            this.examPlanks = physicalExam.examPlanks;
        } else {
            this.preExamRun = 0;
            this.preExamPushUps = 0;
            this.preExamSitUps = 0;
            this.preExamBurpees = 0;
            this.preExamPullUps = 0;
            this.preExamPlanks = 0;
            this.examRun = 0;
            this.examPushUps = 0;
            this.examSitUps = 0;
            this.examBurpees = 0;
            this.examPullUps = 0;
            this.examPlanks = 0;
        }
    }
}
