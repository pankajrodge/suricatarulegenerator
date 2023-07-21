import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicContainerComponent } from './dynamic-container/dynamic-container.component';
import { MobileComponent } from './mobile/mobile.component';
import { LaptopComponent } from './laptop/laptop.component';



@NgModule({
  declarations: [
    DynamicContainerComponent,
    MobileComponent,
    LaptopComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [DynamicContainerComponent]
})
export class DynamicComponentsModule { }
