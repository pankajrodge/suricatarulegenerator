// shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  /*
  private selectedOptionSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private selectedOptionUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get selectedOption$() {
    return [this.selectedOptionSubject.asObservable(), this.selectedOptionUrl.asObservable()];
  }

  setSelectedOption(option: string, url:string) {
    this.selectedOptionSubject.next(option);
    this.selectedOptionUrl.next(url)
  }
*/
  private dataSubject = new Subject<any>();

  setData(data: any) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }


}
