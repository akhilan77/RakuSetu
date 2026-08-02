export class EligibilityService {
  calculateEligibility(dob: Date, weight: number): 'ELIGIBLE' | 'TEMPORARILY_DEFERRED' {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18 || age > 65) {
      return 'TEMPORARILY_DEFERRED';
    }

    if (weight < 50) {
      return 'TEMPORARILY_DEFERRED';
    }

    return 'ELIGIBLE';
  }
}

export const eligibilityService = new EligibilityService();
