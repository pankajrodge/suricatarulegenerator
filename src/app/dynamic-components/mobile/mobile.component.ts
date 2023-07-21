import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  @Input() name: string = ''
  @Input() htmlContent: string =  ''

  @Output() closed = new EventEmitter<any>();
  ngOnInit(): void {
  }

  close() {
    this.closed.emit({
      name: this.name
    })
  }

}
