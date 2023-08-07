import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpComponent } from './tcp.component';

describe('TcpComponent', () => {
  let component: TcpComponent;
  let fixture: ComponentFixture<TcpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TcpComponent]
    });
    fixture = TestBed.createComponent(TcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
