import { Component, OnInit, TemplateRef, ViewChild, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { JsonReaderService } from '../json-reader.service';
import { Form, FormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import axios, { AxiosResponse } from 'axios';
//import { sprintf } from 'sprintf-js';
import * as constants from '../../assets/help';
import * as attributes from '../../assets/constant';




@Component({
  selector: 'app-udp',
  templateUrl: './udp.component.html',
  styleUrls: ['./udp.component.css']
})
export class UdpComponent implements OnInit {
  @Input() public check_protocol = '';
  @Input() public check_url = '';
  server = "10.203.38.232:9000"
  dynamicForm!: FormGroup;
  specialCharacterPattern = /[!@#$%^&*(),?":{}|<>]/;
  
  url_keyword: string = '../assets/keyword.json';
  url_valid_html_tag = '../assets/valid_html_tag.json'
  url_valid_attributes = '../assets/valid_attributes.json'

  protocol = ''
  url_http = ''

  public valid_html_tags:any = []
  public valid_attributes:any = []
  public json_keyword:any
  public protocol_json_data:any

  public common_field_help_and_error_message:any = {}

  public content_modifier_error_message = "** Specify content Match string"
  public content_modifier_showErrorMessage = false
  public disabledContentMatchButton: boolean = false
  public showContentMatchTextBox = false
  public showContentMatchTable = false
  public showcontentTable = false

  public content_modifier_global_dict:any = {}


  public content_match_text_box:any = undefined
  public content_dict = {
    "content_modifier_negate": false,
    "content_modifier_selected": undefined
  }

  public content_modifier_object:any = {}
  constructor(
    private jsonService: JsonReaderService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private location: Location,
    private router: Router
  ) {

    this.dynamicForm = this.formBuilder.group({});
  }

  ngOnChanges() {
    this.dynamicForm.reset()
    this.protocol = ''
    this.url_http = ''

    this.get_all_data("ngOnChanges")
  }


  ngOnInit() {
    
    this.get_all_data("ngOnInit")    
  } 

  get_all_data(text:string) {
    

    this.http.get(this.url_valid_html_tag).subscribe((data1) => {
      this.valid_html_tags = data1
    });

    this.http.get(this.url_valid_attributes).subscribe((data2) => {
      this.valid_attributes = data2
    });

    this.http.get(this.url_keyword).subscribe((data3) => {
      this.json_keyword = data3
    });

    this.sharedService.getData().subscribe(data => {
      this.check_protocol = data.protocol.toLowerCase();
      this.check_url = data.check_url;
    });

    this.http.get(this.check_url).subscribe((data4) => {
      this.protocol_json_data = data4
      this.createFormControlForCommonField()
      this.create_form_control_for_content_modifier()
      this.populate_content_modifier_object()
      this.generateErrorMeesageDictForCommonField()
    });
  }

  createFormControlForCommonField() {
    /*
    Create form control for common field
    */
   
    if (this.protocol_json_data["common"]['supported_options']) {
      for (let field of this.protocol_json_data["common"]['supported_options']) {
        if(this.check_if_valid_html_tag_present(field)) {  //check if valid html tag is present
          if(this.is_form_array(field)) { //check if we need to create form array control or simple form control
            if(this.get_html_tag_type(field) === "ordered_tag_mandatory_optional"){
              //this.dynamicForm.addControl(field, this.formBuilder.group({}));
              let new_form_group = this.formBuilder.group({});
              for(let oName of this.get_order_name_list(field)) {
                new_form_group.addControl(oName, this.formBuilder.control(''));
              }

              this.dynamicForm.addControl(field, new_form_group);
              
            } else {
              this.dynamicForm.addControl(field, this.formBuilder.array([]));  // for form array control
            }
            
          } else {
            this.dynamicForm.addControl(field, new FormControl('')); // for simple form  control
          }
        } else {
          // if valid tag is not specified, throu exception
          throw new Error("Invalid tag specified : " + field);
        }
      
       }
      }

  }

  create_form_control_for_content_modifier() {
    this.dynamicForm.addControl("content_modifer", this.formBuilder.group({}))
  }

  populate_content_modifier_object() {
    if (this.protocol_json_data["content"]['supported_options']) {
      for (let field of this.protocol_json_data["content"]['supported_options']) {
        if(this.get_html_tag_type(field) == 'text') {
          this.content_modifier_object[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'check_box') {
          this.content_modifier_object[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'na') {
          this.content_modifier_object[field]= undefined
        }
        if(this.get_html_tag_type(field) == 'check_box_list') {
          this.content_modifier_object[field] = []
        }
        if(this.get_html_tag_type(field) == 'drop_down') {
          this.content_modifier_object[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'ordered_tag_mandatory_optional') {
          this.content_modifier_object[field]={}
          for(let oName of this.get_order_name_list(field)) {
            if(this.get_order_name_html_type(field, oName) == 'text') {
              this.content_modifier_object[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'drop_down') {
              this.content_modifier_object[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'check_box') {
              this.content_modifier_object[field][oName] = undefined
            }
          }
          
        }
      }
    }
  }

  reset_content_modifier(field:any) {
    if(this.get_html_tag_type(field) == 'text') {
      this.content_modifier_object[field] = undefined
    }
    if(this.get_html_tag_type(field) == 'check_box') {
      this.content_modifier_object[field] = undefined
    }
    if(this.get_html_tag_type(field) == 'na') {
      this.content_modifier_object[field]= undefined
    }
    if(this.get_html_tag_type(field) == 'check_box_list') {
      this.content_modifier_object[field] = []
    }
    if(this.get_html_tag_type(field) == 'drop_down') {
      this.content_modifier_object[field] = undefined
    }
    if(this.get_html_tag_type(field) == 'ordered_tag_mandatory_optional') {
      this.content_modifier_object[field]={}
    }

  }

  get_content_modifier_ng_model(field:string, oName=''): any {
    if(oName === undefined || oName =='') {
      //return "this.content_modifier_object[" + field + "]"
      return this.content_modifier_object[field]
    } 
    //return "this.content_modifier_object[" + field + "][" + oName + "]"
    return this.content_modifier_object[field][oName]
  }

  check_if_valid_html_tag_present(field:string): boolean {
    let t_html_tag = this.json_keyword[field]["html_tag_type"]
    if(this.valid_html_tags.hasOwnProperty(t_html_tag)) {
      return true
    }
    return false
  }


  onSubmit() {
    console.log(this.dynamicForm.value)
  }

  generateErrorMeesageDictForCommonField() {
    if (this.protocol_json_data["common"]['supported_options']) {
      for (let field of this.protocol_json_data["common"]['supported_options']) {
        this.common_field_help_and_error_message[field] = {}
        this.common_field_help_and_error_message[field]["showErrorMessage"] = false
        this.common_field_help_and_error_message[field]["errorMessage"] = ''
        this.common_field_help_and_error_message[field]["showHelpMessage"] = false
      }
    }
  } 

  toggleHelp(field: string): void {
    for (let f in this.common_field_help_and_error_message) { 
      if(f != field) {
        this.common_field_help_and_error_message[f]["showHelpMessage"] = false
      }
    }
    if (field != 'all') {
      this.common_field_help_and_error_message[field]["showHelpMessage"] = !this.common_field_help_and_error_message[field]["showHelpMessage"]
    }
  }

get_help_string(key: string) {
  const t_new_key = key.replace(':', '_').replace('.','_') as keyof typeof constants;
  if(constants[t_new_key]) {
    return constants[t_new_key]
  }
  return ""
}

handleCheckboxChange(event: any, formarrayname:any) {
  if(this.json_keyword[formarrayname]["html_tag_type"] === "check_box") {
    this.setValueInFormControl(formarrayname, event.target.checked)
  } 

  if(this.json_keyword[formarrayname]["html_tag_type"] === "check_box_list") {
    const checkboxesArray = this.dynamicForm.get(formarrayname) as FormArray;
    if (event.target.checked) {
      checkboxesArray.push(this.formBuilder.control(event.target.value));
    } else {
      const index = checkboxesArray.controls.findIndex(x => x.value === event.target.value);
      checkboxesArray.removeAt(index);
    }
  }
}

object_check_box_change(event:any, field:any, oName:string = '') {
  console.log("Oname " + oName)
  if(oName === '' || oName === undefined){
    if(this.get_html_tag_type(field) == 'check_box') {
      this.content_modifier_object[field] = event.target.checked
    }
  
    if(this.get_html_tag_type(field) == 'check_box_list') {
      if (event.target.checked) {
        this.content_modifier_object[field].push(event.target.value);
      } else {
        let index = this.content_modifier_object[field].indexOf(event.target.value)
        this.content_modifier_object[field].splice(index, 1);
      }
    }
  } else {
    if(this.get_order_name_html_type(field, oName) == 'check_box') {
      this.content_modifier_object[field][oName] = event.target.checked
    } 

    if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
      if (event.target.checked) {
        this.content_modifier_object[field][oName].push(event.target.value);
      } else {
        let index = this.content_modifier_object[field][oName].indexOf(event.target.value)
        this.content_modifier_object[field][oName].splice(index, 1);
      }
    }

  }

  

}


get_lable_description(field: string): string {
  if(this.json_keyword[field].hasOwnProperty("lable_descrption")) {
    return this.json_keyword[field].lable_descrption
  }
  return field
}



setValueInFormControl(controlName:any, newValue:any) {
  if(this.is_form_array(controlName)) {
    if(!this.dynamicForm.get(controlName)) {
      this.dynamicForm.addControl(controlName, this.formBuilder.array([]));
    } 
    const formControl = this.dynamicForm.get(controlName) as FormArray;
    formControl.setValue(newValue);
  } else {
    if(!this.dynamicForm.get(controlName)) {
      this.dynamicForm.addControl(controlName, new FormControl(''));
    } 
    const formControl = this.dynamicForm.get(controlName) as FormControl;
    formControl.setValue(newValue);
  }
  
}

get_html_tag_type(field:string): string {
  //console.log(field)
  return this.json_keyword[field]["html_tag_type"]
  
}

is_form_array(field:string): boolean {
  let t_html_tag_type = this.get_html_tag_type(field)
  if(this.valid_html_tags[t_html_tag_type] === "form_array") {
    return true
  }
  return false
}

get_order_name_list(field:string): string[] {
  return this.json_keyword[field]["order_name"]
}

get_order_name_html_type(field:string, order_name:string): string {
  let index_of_order_name = this.getIndexOfOrderTag(field, order_name)
  return this.json_keyword[field]["order"][index_of_order_name]
}

getIndexOfOrderTag(key:string, value:string) {
  return this.json_keyword[key]["order_name"].indexOf(value)
}

get_drop_down_dict_for_order(field:string, order_name:string):any {
  if(this.json_keyword[field]["drop_down_dict"][order_name]) {
    return this.json_keyword[field]["drop_down_dict"][order_name]
  } else {
    throw new Error("Drop down dict is not defined for order_name : " + order_name + " in " + field);
  }
}

get_drop_down_dict(field:string):any {
  if(this.json_keyword[field]["drop_down_dict"]) {
    return this.json_keyword[field]["drop_down_dict"]
  } else {
    throw new Error("Drop down dict is not defined for order_name : " + field);
  }
}

get_nested_form_group(field:string): FormGroup {
  let fg = this.dynamicForm.get(field) as FormGroup
  return fg
}

addContentMatch() {
  this.showContentMatchTextBox = true
  this.disabledContentMatchButton = true
  this.showContentMatchTable = true
  this.showcontentTable = true
}

negateContentModifierContent(event: any) {
  if (event.target.checked) {
    this.content_dict.content_modifier_negate= true;
  } else {
    this.content_dict.content_modifier_negate = false;
  }
}

get_content_modifier(): string[] {
  return this.protocol_json_data['content']['supported_options']
}

clear_content_match_dict() {
  this.content_dict["content_modifier_negate"] = false
  this.content_dict["content_modifier_selected"] = undefined
  this.content_match_text_box = undefined


}

add_content_modifier(content_string:any, negate:any, content_modifier:any) {
  console.log(content_string, negate, content_modifier)
  console.log(this.content_modifier_object)

  if(!this.content_modifier_global_dict.hasOwnProperty(content_string)) {
    this.content_modifier_global_dict[content_string] = []
  }
  let temp_dict:any = {}
  temp_dict["negate"] = negate
  if(content_modifier !== undefined) {
    temp_dict[content_modifier] = this.content_modifier_object[content_modifier]
  }

  this.content_modifier_global_dict[content_string].push(temp_dict)
  this.update_form_control_for_content_modifier()
  this.clear_content_match_dict()
  console.log(this.content_modifier_global_dict)



  //this.reset_content_modifier(content_modifier)
  //console.log(this.content_modifier_object)
}

update_form_control_for_content_modifier() {
/*
  const formControl = this.dynamicForm.get("content_modifer") as FormGroup;
    formControl.setValue(this.content_modifier_global_dict);
*/
    this.dynamicForm.addControl("content_modifer", this.content_modifier_global_dict)
}


}

