import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

// This code is taken from https://angular.io/guide/testing#activatedroutestub

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  /** The mock paramMap observable */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly paramMap = this.subject.asObservable();

  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}
