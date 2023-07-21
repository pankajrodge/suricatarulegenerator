import { Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MobileComponent } from '../mobile/mobile.component';
import { LaptopComponent } from '../laptop/laptop.component';

@Component({
  selector: 'app-dynamic-container',
  templateUrl: './dynamic-container.component.html',
  styleUrls: ['./dynamic-container.component.css']
})
export class DynamicContainerComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef, static: true})
  container!: ViewContainerRef
  ngOnInit(): void{
  }

  components = new Map<string, ComponentRef<any>>();
  index: number = 0;

  createComponent(componentName:string) {
    const compType =this.getComponentType(componentName)
    let uniqName = componentName + "-" + this.index.toString();
    const component = this.container.createComponent(compType)
    component.instance.name = uniqName;
    component.instance.closed.subscribe((res:any) =>{
      this.deleteComponent(res.name)
    })

    this.components.set(uniqName, component);
    this.index++;
    
  }


  deleteComponent(componentName: string) {
    if(this.components.has(componentName)) {
      this.components.get(componentName)?.destroy();
      this.components.delete(componentName)
    }
  }

  getComponentType(name:string): Type<any> {
    let type:Type<any> =MobileComponent
    switch(name) {
      case "mobile": {
        type = MobileComponent;
        break
      }
      case "laptop": {
        type = LaptopComponent;
        break
      }
    }
    return type
  }
}



