import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ChronoUnit, LocalDate } from "@js-joda/core";

export class CustomValidators {

    public static validateCycleDates(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let hasErrors = false;
      
            if (control.get('cycleStart') == null || control.get('cycleEnd') == null ) {
                return null;
            }
      
            const cycleStart = control.get('cycleStart') as FormControl;
            const cycleEnd = control.get('cycleEnd') as FormControl;

            const startDate = cycleStart!.value as LocalDate;
            const endDate = cycleEnd!.value as LocalDate;
      
            // Ensure that the cycle start date is before the cycle end date
            if (startDate.isAfter(endDate)) {
                this.addError(cycleStart, 'startAfter');
                hasErrors = true;
            } else {
                this.clearError(cycleStart, 'startAfter');
            }
      
            // Ensure that the cycle end date is after the cycle start date
            if (endDate.isBefore(startDate)) {
                this.addError(cycleEnd, 'endBefore');
                hasErrors = true;
            } else {
                this.clearError(cycleEnd, 'endBefore');
            }
      
            // Ensure that the cycle date range consists of full weeks (multiple of 7 days)
            if ((startDate.until(endDate.plusDays(1), ChronoUnit.DAYS).valueOf() % 7) !== 0) {
                this.addError(cycleEnd, 'notWeeks');
                hasErrors = true;
            } else {
                this.clearError(cycleEnd, 'notWeeks');
            }
      
            // If a cycle pre-start date is provided, it MUST be before the cycle start date
            if (control.get('cyclePreStart') && control.get('cyclePreStart')!.value) {
                const cyclePreStart = control.get('cyclePreStart') as FormControl;
                const preStartDate = cyclePreStart!.value as LocalDate;
      
                if (preStartDate.isAfter(startDate)) {
                    this.addError(cyclePreStart, 'startAfter');
                    hasErrors = true;
                } else {
                    this.clearError(cyclePreStart, 'startAfter');
                }
            }
            
            // If a cycle post-end date is provided, it MUST be after the cycle end date
            if (control.get('cyclePostEnd') && control.get('cyclePostEnd')!.value) {
                const cyclePostEnd = control.get('cyclePostEnd') as FormControl;
                const postEndDate = control.get('cyclePostEnd')!.value as LocalDate;
      
                if (postEndDate.isBefore(endDate)) {
                    this.addError(cyclePostEnd, 'endBefore');
                    hasErrors = true;
                } else {
                    this.clearError(cyclePostEnd, 'endBefore');
                }
            }
      
            return hasErrors ? { 'cycleDates': true } : null;
          }
    }

    public static integerInput(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            console.debug(`[DEBUG]`, control, control.value);
            return null;
        }
    }

    private static hasErrors(control: AbstractControl): boolean {
        return control?.errors ? true : false;
    }
    
    private static hasError(control: AbstractControl, error: string): boolean {
        return control.hasError(error);
    }
    
    private static addError(control: AbstractControl, error: string) {
        control.setErrors({...control.errors, [error]: true });
    }
    
    private static clearError(control: AbstractControl, error: string) {
    if (control.errors && control.errors[error]) {
        delete control.errors[error];
        if (!Object.keys(control.errors).length) {
            control.setErrors(null);
        } else {
            control.setErrors(control.errors);
        }
        }
    }
}
