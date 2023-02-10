import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Candidate } from "@core/interfaces/candidate";
import { CandidateTracking } from "@core/interfaces/candidate-tracking";
import { Tracking } from "@core/interfaces/tracking";
import { TrackingService } from "@core/services/tracking.service";
import { LocalDate } from "@js-joda/core";
import { NGXLogger } from "ngx-logger";
import { BehaviorSubject, map, Observable, of, tap } from "rxjs";

export class ActivityDataSource  extends DataSource<Tracking> {

    private currentDataSubject: BehaviorSubject<Tracking[]> = new BehaviorSubject<Tracking[]>([]);
    currentData$: Observable<Tracking[]> = this.currentDataSubject.asObservable();

    candidateTracking: CandidateTracking | null = null;

    dailyTracking: Tracking[] = [];
    
    constructor(
        private logger: NGXLogger,
        private trackingService: TrackingService
    ) {
        super();
    }

    public connect(collectionViewer: CollectionViewer): Observable<readonly Tracking[]> {
        return this.currentData$;
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        throw new Error("Method not implemented.");
    }

    public fetchCandidateTracking(candidate: Candidate | null, startDate: LocalDate, endDate: LocalDate): void {
        this.logger.debug(`fetchCandidateTracking(...)`, candidate, startDate, endDate);
        this.trackingService.getCandidateTracking(candidate, startDate, endDate)
            .pipe(
                map((tracking) => {
                    this.candidateTracking = tracking;
                    this.dailyTracking = tracking.daily;
                    this.logger.debug('NEXT...', this.dailyTracking);
                    this.currentDataSubject.next(this.dailyTracking);
                })
            );
    }
}
