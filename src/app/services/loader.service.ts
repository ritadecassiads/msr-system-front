import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  show(): void {
    console.log('show loader');
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

}