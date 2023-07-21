import { Component } from '@angular/core';
import { SharedService } from './shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'suricatarulegenerator';

  showApp = false
  select_protocol=undefined
  check_protocol=''
  selectedOption: string = '';
  check_url: string = ''


  protocol_list = ["HTTP", "DNS"]
  protocol_dict:any ={
    "http": "../assets/http.json",
    "dns": "../assets/dns.json"
  }

  constructor(private sharedService: SharedService) {}

  onOptionSelected() {
    if(this.selectedOption !== "") {
      this.showApp = true
      console.log(this.selectedOption)
  
      this.check_protocol = this.selectedOption
      this.check_url = this.protocol_dict[this.selectedOption.toLowerCase()]
  
      const data = {
        protocol: this.selectedOption,
        check_url: this.protocol_dict[this.selectedOption.toLowerCase()]
      };
      this.sharedService.setData(data);
    } else {
      this.showApp = false
    }

  }



}
