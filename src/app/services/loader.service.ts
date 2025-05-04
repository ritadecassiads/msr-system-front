import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  show(): void {
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

}