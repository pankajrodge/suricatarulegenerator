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
import * as constants from '../../assets/help';



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
  formVisible = false;
  
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

  public user_selected_content_modifier:any = {
    "rows": [],
    "display": []
  }
  public content_match_text_box:any = undefined
  public content_dict = {
    "content_modifier_negate": false,
    "content_modifier_selected": undefined
  }
  public content_modifier_object:any = {}


  public common_object_dict:any = {}


  public protocol_content_dict:any = {}
  public protocol_content_modifier_dict:any = {}
  public protocol_content_object_dict:any = {}
  public protocol_content_modifier_object_dict:any = {}

  public user_selected_protocol_details:any = {}

  public disable_meta_keyword:boolean = false
  public show_meta_keyword_table:boolean = false
  public meta_keyword_selected:any = undefined
  public meta_keyword_object_dict:any = {}

  public user_selected_meta_keyword:any = {}

  public final_suricata_rule_list:any = []
  public final_suricata_rule_check_status_list:any = []

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

    setTimeout(() => {
      this.formVisible = true; // Display the form after the delay
    }, 0

    )
  }


  ngOnInit() {
    
    this.get_all_data("ngOnInit") 

    setTimeout(() => {
      this.formVisible = true; // Display the form after the delay
    }, 0

    )
       
  } 

  get_all_data(text:string) {
    console.log(text)

    if(this.valid_html_tags.length === 0) {
      console.log("skipping valid_html_tags")
      this.http.get(this.url_valid_html_tag).subscribe((data1) => {
        this.valid_html_tags = data1
      });
    }
    
    if(this.valid_attributes.length === 0) {
      console.log("skipping valid_attributes")
      this.http.get(this.url_valid_attributes).subscribe((data2) => {
        this.valid_attributes = data2
      });
    }
    
    if(this.json_keyword === undefined) {
      this.http.get(this.url_keyword).subscribe((data3) => {
        this.json_keyword = data3
      });
    }
    
    this.sharedService.getData().subscribe(data => {
      this.check_protocol = data.protocol.toLowerCase();
      this.check_url = data.check_url;
    });

    this.http.get(this.check_url).subscribe((data4) => {
      this.protocol_json_data = data4

      // for content modifier
      //this.createFormControlForCommonField()

      this.populate_common_object()
      this.populate_content_modifier_object()
      this.generateErrorMeesageDictForCommonField()

      //for protocol content
      this.prepare_protocol_content_dict() 
      this.prepare_protocol_content_modifier_dict()

      //for protocol
      this.populate_protocol_object_dict()

      this.populate_user_selected_protocol_details_dict()

      this.populate_meta_keyword_object_dict()

      this.populate_user_selected_meta_keyword()
    });

    setTimeout(() => {
      this.formVisible = true; // Display the form after the delay
    }, 2000)

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


  populate_meta_keyword_object_dict() {
    if (this.protocol_json_data["meta_keyword"]['supported_options']) {
      for (let field of this.protocol_json_data["meta_keyword"]['supported_options']) {
        if(this.get_html_tag_type(field) == 'text') {
          this.meta_keyword_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'check_box') {
          this.meta_keyword_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'na') {
          this.meta_keyword_object_dict[field]= undefined
        }
        if(this.get_html_tag_type(field) == 'check_box_list') {
          this.meta_keyword_object_dict[field] = []
        }
        if(this.get_html_tag_type(field) == 'drop_down') {
          this.meta_keyword_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'ordered_tag_mandatory_optional') {
          this.meta_keyword_object_dict[field]={}
          for(let oName of this.get_order_name_list(field)) {
            if(this.get_order_name_html_type(field, oName) == 'text') {
              this.meta_keyword_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'drop_down') {
              this.meta_keyword_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'check_box') {
              this.meta_keyword_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
              this.meta_keyword_object_dict[field][oName] = []
            }
          }
          
        }
      }
    }
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
            if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
              this.content_modifier_object[field][oName] = []
            }
          }
          
        }
      }
    }
  }


  populate_common_object() {
    if (this.protocol_json_data["common"]['supported_options']) {
      for (let field of this.protocol_json_data["common"]['supported_options']) {
        if(this.get_html_tag_type(field) == 'text') {
          this.common_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'check_box') {
          this.common_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'na') {
          this.common_object_dict[field]= undefined
        }
        if(this.get_html_tag_type(field) == 'check_box_list') {
          this.common_object_dict[field] = []
        }
        if(this.get_html_tag_type(field) == 'drop_down') {
          this.common_object_dict[field] = undefined
        }
        if(this.get_html_tag_type(field) == 'ordered_tag_mandatory_optional') {
          this.common_object_dict[field]={}
          for(let oName of this.get_order_name_list(field)) {
            if(this.get_order_name_html_type(field, oName) == 'text') {
              this.common_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'drop_down') {
              this.common_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'check_box') {
              this.common_object_dict[field][oName] = undefined
            }
            if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
              this.common_object_dict[field][oName] = []
            }
          }
          
        }
      }
    }
  }

  populate_user_selected_protocol_details_dict() {
    for(let proto_param of this.get_protocol_detail_list()){
      this.user_selected_protocol_details[proto_param] = {}
      this.user_selected_protocol_details[proto_param]["rows"] = []
      this.user_selected_protocol_details[proto_param]["display"] = []
    }
  }

  populate_user_selected_meta_keyword() {
    this.user_selected_meta_keyword["rows"] = []
    this.user_selected_meta_keyword["display"] = []
  }

  populate_protocol_object_dict() {
    for(let proto_param of this.get_protocol_detail_list()){
      if(!this.protocol_content_object_dict[proto_param]) {
        this.protocol_content_object_dict[proto_param] = {}
      }
  
      for(let supp_option of this.get_protocol_supported_options(proto_param)) {
        if(['text', 'check_box', 'na', 'drop_down'].includes(this.get_html_tag_type(supp_option))) {
          if(! this.protocol_content_object_dict[proto_param][supp_option]) {
            this.protocol_content_object_dict[proto_param][supp_option] = undefined
          }
          
        }
        if(this.get_html_tag_type(supp_option) == 'check_box_list') {
          if(! this.protocol_content_object_dict[proto_param][supp_option]) {
            this.protocol_content_object_dict[proto_param][supp_option] = []
          }
        }

        if(this.get_html_tag_type(supp_option) == 'ordered_tag_mandatory_optional') {
          if(! this.protocol_content_object_dict[proto_param][supp_option]) {
            this.protocol_content_object_dict[proto_param][supp_option]={}
          }
          
          for(let oName of this.get_order_name_list(supp_option)) {
            if(this.get_order_name_html_type(supp_option, oName) == 'text') {
              this.protocol_content_object_dict[proto_param][supp_option][oName] = undefined
            }
            if(this.get_order_name_html_type(supp_option, oName) == 'drop_down') {
              this.protocol_content_object_dict[proto_param][supp_option][oName] = undefined
            }
            if(this.get_order_name_html_type(supp_option, oName) == 'check_box') {
              this.protocol_content_object_dict[proto_param][supp_option][oName] = undefined
            }
            if(this.get_order_name_html_type(supp_option, oName) == 'check_box_list') {
              this.protocol_content_object_dict[proto_param][supp_option][oName] = []
            }
          }
        }
        
        if(this.check_if_supported_content_modifier_present(supp_option)) {
          if(!this.protocol_content_modifier_object_dict[proto_param]) {
            this.protocol_content_modifier_object_dict[proto_param] = {}
          }
          for(let supp_cont_mod of this.get_content_modifier_list_for_protocol_param(supp_option)) {
            if(['text', 'check_box', 'na', 'drop_down'].includes(this.get_html_tag_type(supp_cont_mod))) {
              if(!this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod]) {
                this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod] = undefined
              }
              
            }
            if(this.get_html_tag_type(supp_cont_mod) == 'check_box_list') {
              if(!this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod]) {
                this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod] = []
              }
            }

            if(this.get_html_tag_type(supp_cont_mod) == 'ordered_tag_mandatory_optional') {
              if(!this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod]) {
                this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod]={}
                for(let oName of this.get_order_name_list(supp_cont_mod)) {
                  if(this.get_order_name_html_type(supp_cont_mod, oName) == 'text') {
                    this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod][oName] = undefined
                  }
                  if(this.get_order_name_html_type(supp_cont_mod, oName) == 'drop_down') {
                    this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod][oName] = undefined
                  }
                  if(this.get_order_name_html_type(supp_cont_mod, oName) == 'check_box') {
                    this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod][oName] = undefined
                  }
                  if(this.get_order_name_html_type(supp_cont_mod, oName) == 'check_box_list') {
                    this.protocol_content_modifier_object_dict[proto_param][supp_cont_mod][oName] = []
                  }
                }
              }

            }

          }
        }
      }

    }
  }

  check_if_supported_content_modifier_present(field:string) {
    return this.json_keyword[field].hasOwnProperty("supported_content_modifier")
  }

  get_content_modifier_list_for_protocol_param(field:string) {
    return this.json_keyword[field]["supported_content_modifier"]
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
    /*
    this.generateErrorMeesageDictForCommonField()
    if(this.dynamicForm.contains("common_field")) {
      this.dynamicForm.removeControl("common_field")
    }
    this.dynamicForm.addControl('common_field', this.formBuilder.control(this.common_object_dict))
    */
    
    if(!this.validate_common_part()) {
      //console.log("input correct")
      if(this.dynamicForm.contains("common_field")) {
        this.dynamicForm.removeControl("common_field")
      }
      this.dynamicForm.addControl('common_field', this.formBuilder.control(this.common_object_dict))
    } else {
      //console.log("input incorrect")
    }

    console.log(this.dynamicForm.value)
    this.generate_suricata_rules()
    this.checkRules()

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

    if (this.protocol_json_data["content"]['supported_options']) {
      for (let field of this.protocol_json_data["content"]['supported_options']) {
          this.common_field_help_and_error_message[field] = {}
          this.common_field_help_and_error_message[field]["showErrorMessage"] = false
          this.common_field_help_and_error_message[field]["errorMessage"] = ''
          this.common_field_help_and_error_message[field]["showHelpMessage"] = false
      }
    }

    if (this.protocol_json_data["meta_keyword"]['supported_options']) {
      for (let field of this.protocol_json_data["meta_keyword"]['supported_options']) {
          this.common_field_help_and_error_message[field] = {}
          this.common_field_help_and_error_message[field]["showErrorMessage"] = false
          this.common_field_help_and_error_message[field]["errorMessage"] = ''
          this.common_field_help_and_error_message[field]["showHelpMessage"] = false
      }
    }

    if (this.protocol_json_data["protocol"]) {
      for(let proto_param of this.get_protocol_detail_list()) {
        for(let k of this.get_protocol_supported_options(proto_param)) {
            this.common_field_help_and_error_message[k] = {}
            this.common_field_help_and_error_message[k]["showHelpMessage"] = false
  
          //check_if_supported_content_modifier_present
        //get_content_modifier_list_for_protocol_param
          if(this.check_if_supported_content_modifier_present(k)) {
            for(let f of this.get_content_modifier_list_for_protocol_param(k)) {
 
                this.common_field_help_and_error_message[f] = {}
                this.common_field_help_and_error_message[f]["showHelpMessage"] = false
         
            }
          }

        }

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

object_check_box_change_for_common_field(event:any, field:any, oName:string = '') {
  if(oName === '' || oName === undefined){
    if(this.get_html_tag_type(field) == 'check_box') {
      this.common_object_dict[field] = event.target.checked
    }
    if(this.get_html_tag_type(field) == 'check_box_list') {
      if (event.target.checked) {
        this.common_object_dict[field].push(event.target.value);
      } else {
        let index = this.common_object_dict[field].indexOf(event.target.value)
        this.common_object_dict[field].splice(index, 1);
      }
    }
  } else {
    if(this.get_order_name_html_type(field, oName) == 'check_box') {
      this.common_object_dict[field][oName] = event.target.checked
    } 

    if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
      if (event.target.checked) {
        this.common_object_dict[field][oName].push(event.target.value);
      } else {
        let index = this.common_object_dict[field][oName].indexOf(event.target.value)
        this.common_object_dict[field][oName].splice(index, 1);
      }
    }
  }
}


object_check_box_change_for_metakeyword(event:any, field:any, oName:string = '') {
  if(oName === '' || oName === undefined){
    if(this.get_html_tag_type(field) == 'check_box') {
      this.meta_keyword_object_dict[field] = event.target.checked
    }
    if(this.get_html_tag_type(field) == 'check_box_list') {
      if (event.target.checked) {
        this.meta_keyword_object_dict[field].push(event.target.value);
      } else {
        let index = this.meta_keyword_object_dict[field].indexOf(event.target.value)
        this.meta_keyword_object_dict[field].splice(index, 1);
      }
    }
  } else {
    if(this.get_order_name_html_type(field, oName) == 'check_box') {
      this.meta_keyword_object_dict[field][oName] = event.target.checked
    } 

    if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
      if (event.target.checked) {
        this.meta_keyword_object_dict[field][oName].push(event.target.value);
      } else {
        let index = this.meta_keyword_object_dict[field][oName].indexOf(event.target.value)
        this.meta_keyword_object_dict[field][oName].splice(index, 1);
      }
    }
  }
}

object_check_box_change_for_protocol(event:any, proto_param:any, field:any, oName:string = '') {
  if(oName === '' || oName === undefined){
    if(this.get_html_tag_type(field) == 'check_box') {
      this.protocol_content_object_dict[proto_param][field] = event.target.checked
    }
    if(this.get_html_tag_type(field) == 'check_box_list') {
      if (event.target.checked) {
        this.protocol_content_object_dict[proto_param][field].push(event.target.value);
      } else {
        let index = this.protocol_content_object_dict[proto_param][field].indexOf(event.target.value)
        this.protocol_content_object_dict[proto_param][field].splice(index, 1);
      }
    }
  } else {
    if(this.get_order_name_html_type(field, oName) == 'check_box') {
      this.protocol_content_object_dict[proto_param][field][oName] = event.target.checked
    } 

    if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
      if (event.target.checked) {
        this.protocol_content_object_dict[proto_param][field][oName].push(event.target.value);
      } else {
        let index = this.content_modifier_object[field][oName].indexOf(event.target.value)
        this.protocol_content_object_dict[proto_param][field][oName].splice(index, 1);
      }
    }
  }
}


object_check_box_change_for_protocol_content_modifier(event:any, proto_param:any, field:any, oName:string = '') {
  if(oName === '' || oName === undefined){
    if(this.get_html_tag_type(field) == 'check_box') {
      this.protocol_content_modifier_object_dict[proto_param][field] = event.target.checked
    }
    if(this.get_html_tag_type(field) == 'check_box_list') {
      if (event.target.checked) {
        this.protocol_content_modifier_object_dict[proto_param][field].push(event.target.value);
      } else {
        let index = this.protocol_content_modifier_object_dict[proto_param][field].indexOf(event.target.value)
        this.protocol_content_modifier_object_dict[proto_param][field].splice(index, 1);
      }
    }
  } else {
    if(this.get_order_name_html_type(field, oName) == 'check_box') {
      this.protocol_content_modifier_object_dict[proto_param][field][oName] = event.target.checked
    } 

    if(this.get_order_name_html_type(field, oName) == 'check_box_list') {
      if (event.target.checked) {
        this.protocol_content_modifier_object_dict[proto_param][field][oName].push(event.target.value);
      } else {
        let index = this.protocol_content_modifier_object_dict[field][oName].indexOf(event.target.value)
        this.protocol_content_modifier_object_dict[proto_param][field][oName].splice(index, 1);
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

sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async delayedAction() {
  await this.sleep(2000); // Sleep for 2000 milliseconds (2 seconds)
}


get_html_tag_type(field:string): string {
  //console.log(field)
  //console.log(this.json_keyword)
  for (let i = 1; i <= 3; i++) {
    if(this.json_keyword === undefined) {
      this.delayedAction()
    } else {
      break
    }
  }
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
    console.log("missing drop down dict for " + field)
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

negate_protocol_content(event: any, proto_param:any) {
  if (event.target.checked) {
    this.protocol_content_dict.negate= true;
  } else {
    this.protocol_content_dict.negate = false;
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
  this.content_modifier_showErrorMessage = false
  this.content_modifier_error_message = ""
  if(content_string === '' || content_string === undefined) {
    this.content_modifier_showErrorMessage = true
    this.content_modifier_error_message = "** Please specify the content string"
    return
  } else {
    this.content_modifier_showErrorMessage = false
  }

  if(content_modifier !== undefined && this.get_html_tag_type(content_modifier) !== 'na') {
    if(this.validate_content_modifier(content_modifier)) {
      this.content_modifier_showErrorMessage = true
      return
    }
  }


  if(content_modifier !== undefined || content_modifier != '') {
    if(this.get_html_tag_type(content_modifier) !== 'na') {
      this.user_selected_content_modifier["rows"].push([content_string, negate, content_modifier, this.content_modifier_object[content_modifier]])
      this.user_selected_content_modifier["display"].push([content_string, negate, content_modifier + "=" + JSON.stringify(this.content_modifier_object[content_modifier])])
    } else {
      this.user_selected_content_modifier["rows"].push([content_string, negate, content_modifier, undefined])
      this.user_selected_content_modifier["display"].push([content_string, negate, content_modifier, 'Not Applicable'])
    }
    
  } else {
    this.user_selected_content_modifier["rows"].push([content_string, negate, undefined, undefined])
    this.user_selected_content_modifier["display"].push([content_string, negate, '', ''])
  }

  //console.log("dynamic for before process_content_modifier")
  //console.log(this.dynamicForm.value)

  this.process_content_modifier()
  this.clear_content_match_dict()
  if(content_modifier !== undefined) {
    this.reset_content_modifier(content_modifier)
  }

}

validate_content_modifier(content_modifier:string):boolean {
  let temp_error_message:string = ''
  if(!this.json_keyword[content_modifier].hasOwnProperty("is_mandatory") && !this.json_keyword[content_modifier].hasOwnProperty("mandatory_option")) {
    if(this.content_modifier_object[content_modifier] === undefined || this.content_modifier_object[content_modifier] === '') {
      this.content_modifier_error_message = "** Please specify the mandatory value for " + content_modifier
      return true
    }
    if(this.get_object_type(this.content_modifier_object[content_modifier]) === 'array'){
      if(this.content_modifier_object[content_modifier].length === 0) {
        this.content_modifier_error_message = "** Please specify the mandatory value for " + content_modifier
      return true
      }
    }

    if(this.get_object_type(this.content_modifier_object[content_modifier]) === 'dict'){
      if(Object.keys(this.content_modifier_object[content_modifier]).length === 0) {
        this.content_modifier_error_message = "** Please specify the mandatory value for " + content_modifier
        return true
      }
    }

  }
  if(this.json_keyword[content_modifier].hasOwnProperty("is_mandatory") && this.json_keyword[content_modifier]["is_mandatory"]) {
    if(this.content_modifier_object[content_modifier] === undefined || this.content_modifier_object[content_modifier] === '') {
      this.content_modifier_error_message = "** Please specify the mandatory value for " + content_modifier
      return true
    }
  }

  if(this.json_keyword[content_modifier].hasOwnProperty("mandatory_option")) {
    if( this.content_modifier_object[content_modifier] === undefined || this.content_modifier_object[content_modifier] === '') {
      this.content_modifier_error_message = "** Please specify the mandatory value for " + content_modifier
      return true
    } else if( Object.keys(this.content_modifier_object[content_modifier]).length === 0) { 
      this.content_modifier_error_message = "** Please specify the mandatory value for " + JSON.stringify(this.json_keyword[content_modifier]["mandatory_option"]) + " of " + content_modifier 
      return true
    } else {
      let temp_error_list:any = []
      for(let field of this.json_keyword[content_modifier]["mandatory_option"]) {
        if(this.get_order_name_html_type(content_modifier, field) == 'check_box_list') {
          if(this.content_modifier_object[content_modifier][field].length === 0) {
            temp_error_list.push(field)
            
          } 
        } else {
          if(this.content_modifier_object[content_modifier][field] === undefined || this.content_modifier_object[content_modifier][field] === '') {
            temp_error_list.push(field)
          }
        }
      }
      if(temp_error_list.length > 0) {
        
        this.content_modifier_error_message = "** Please specify the mandatory value for " + temp_error_list.join(",")
        return true
      }
    }
  }

  return false
}


validate_common_part(): boolean {
  let error_count = 0
  
  this.generateErrorMeesageDictForCommonField()
  //console.log(this.common_object_dict)
  for(let field of this.protocol_json_data["common"]["supported_options"]) {
    if(!this.json_keyword[field].hasOwnProperty("is_mandatory") && !this.json_keyword[field].hasOwnProperty("mandatory_option")) {
      if(this.common_object_dict[field] === undefined || this.common_object_dict[field] === '') {
        this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + field
        this.common_field_help_and_error_message[field].showErrorMessage = true
        error_count +=1
      } else {
        if(this.get_object_type(this.common_object_dict[field]) === 'array'){
          if(this.common_object_dict[field].length === 0) {
            this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + field
            this.common_field_help_and_error_message[field].showErrorMessage = true
            error_count +=1
          }
        }

        if(this.get_object_type(this.common_object_dict[field]) === 'dict'){
          if(Object.keys(this.common_object_dict[field]).length === 0) {
            this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + field
            this.common_field_help_and_error_message[field].showErrorMessage = true
            error_count +=1
          }
        }
      }
   }

   if(this.json_keyword[field].hasOwnProperty("is_mandatory") && this.json_keyword[field]["is_mandatory"]) {
    if(this.common_object_dict[field] === undefined || this.common_object_dict[field] === '') {
      this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + field
      this.common_field_help_and_error_message[field].showErrorMessage = true
      error_count +=1
    }
  }

  if(this.json_keyword[field].hasOwnProperty("mandatory_option")) {
    if( this.common_object_dict[field] === undefined || this.common_object_dict[field] === '') {
      this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + field
      this.common_field_help_and_error_message[field].showErrorMessage = true
      error_count +=1

    } else if( Object.keys(this.common_object_dict[field]).length === 0) { 
      this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + JSON.stringify(this.json_keyword[field]["mandatory_option"]) + " of " + field 
      this.common_field_help_and_error_message[field].showErrorMessage = true
      error_count +=1
    } else {
      let temp_error_list:any = []
      for(let m of this.json_keyword[field]["mandatory_option"]) {
        if(this.get_order_name_html_type(field, m) == 'check_box_list') {
          if(this.common_object_dict[field][m].length === 0) {
            temp_error_list.push(m)
          } 
        } else {
          if(this.common_object_dict[field][m] === undefined || this.common_object_dict[field][m] === '') {
            temp_error_list.push(m)
          }
        }
      }
      if(temp_error_list.length > 0) {
        this.common_field_help_and_error_message[field].errorMessage = "** Please specify the mandatory value for " + temp_error_list.join(",")
        this.common_field_help_and_error_message[field].showErrorMessage = true
        error_count +=1
      }
    }
  }
}
if(error_count > 1) {
  return true
}

return false
}

/*

*/


show_content_modifier_table(): boolean {
  if(this.user_selected_content_modifier["display"].length >0) {
    return true
  }
  return false
}

process_content_modifier() {
  let temp_list:any = []
  
  for(let row of this.user_selected_content_modifier["rows"]) {
    let temp_dict:any = {}
    let content_string = row[0]
    let negate = row[1]
    let content_modifer = row[2]
    let content_modifier_obj = row[3]

    temp_dict["content_string"] = content_string
    temp_dict["negate"] = negate

    if(content_modifer !== undefined && content_modifier_obj !== undefined) {
      temp_dict["content_modifer"] = content_modifer
      temp_dict["content_modifier_obj"] = content_modifier_obj
    } 

    if(content_modifer !== undefined && content_modifier_obj === undefined) {
      temp_dict["content_modifer"] = content_modifer
      temp_dict["content_modifier_obj"] = undefined
    } 


    temp_list.push(temp_dict)
  }

  if(this.dynamicForm.contains("content_modifier")) {
    this.dynamicForm.removeControl("content_modifier")
  }
  
  this.dynamicForm.addControl('content_modifier', this.formBuilder.control(temp_list))

  //console.log("user_selected_content_modifier option  post process_content_modifier")
  //console.log(this.user_selected_content_modifier)

  //console.log("dynamic for post process_content_modifier")
  //console.log(this.dynamicForm.value)

}


get_object_type(obj:any): string {
  if(typeof obj === 'string') {
    return 'string'
  }
  if(typeof obj === 'object') {
    if(Array.isArray(obj)) {
      return "array"
    } else {
      return "dict"
    }
  }
  return "undefined"
}

get_default_value(field:string): string {
  //console.log("default  " + field)
  if(this.json_keyword[field].hasOwnProperty("default_value")) {
    //console.log("default " + field + " " + this.json_keyword[field]["default_value"])
    return this.json_keyword[field]["default_value"]
  }
  return ''
}

getDictionaryKeys(dictionary: { [key: string]: any }): string[] {
  return Object.keys(dictionary);
}

removeFromDataDict(index:any) {
  this.user_selected_content_modifier["rows"].splice(index, 1)
  this.user_selected_content_modifier["display"].splice(index, 1)
  this.process_content_modifier()
}

get_protocol_detail_list(): string[] {
  let temp_list:string[] = []
  for(let t_dict of this.protocol_json_data['protocol']) {
    temp_list.push(...Object.keys(t_dict))
  }
  return temp_list
}


get_protocol_user_table_header_names(item:string): [] {
  for(let t_dict of this.protocol_json_data['protocol']) {
    if(Object.keys(t_dict).includes(item)) {
      return t_dict[item]["supported_options_table_headers"]
    }
  }
  return []
}

get_protocol_supported_options(item:string): [] {
  for(let t_dict of this.protocol_json_data['protocol']) {
    if(Object.keys(t_dict).includes(item)) {
      return t_dict[item]["supported_options"]
    }
  }
  return []
}


prepare_protocol_content_dict() {
  for(let proto_param of this.get_protocol_detail_list()) {
    if(!this.protocol_content_dict.hasOwnProperty(proto_param)) {
      this.protocol_content_dict[proto_param] = {}
    }
    this.protocol_content_dict[proto_param]["show_protocol_selection_table"] = false
    this.protocol_content_dict[proto_param]["show_error_message"] = false
    this.protocol_content_dict[proto_param]["error_message"] = ''
    this.protocol_content_dict[proto_param]["selected"] = undefined
    this.protocol_content_dict[proto_param]["show_content_modifier_table"] = false
    this.protocol_content_dict[proto_param]["negate"] = false
  }
}

prepare_protocol_content_modifier_dict() {
  for(let proto_param of this.get_protocol_detail_list()) {
    if(!this.protocol_content_modifier_dict.hasOwnProperty(proto_param)) {
      this.protocol_content_modifier_dict[proto_param] = {}
    }
    this.protocol_content_modifier_dict[proto_param]["show_protocol_selection_table"] = false
    this.protocol_content_modifier_dict[proto_param]["show_error_message"] = false
    this.protocol_content_modifier_dict[proto_param]["error_message"] = ''
    this.protocol_content_modifier_dict[proto_param]["selected"] = undefined
    this.protocol_content_modifier_dict[proto_param]["show_content_modifier_table"] = false
    this.protocol_content_modifier_dict[proto_param]["negate"] = false
  }
}

show_protocol_content_user_selection_table(proto_param:string) {
  this.protocol_content_dict[proto_param]['show_protocol_selection_table'] = true
}

display_protocol_content_user_selection_table(proto_param:string): boolean {
 return this.protocol_content_dict[proto_param]['show_protocol_selection_table']
}

display_protocol_error_message(proto_param:string): boolean {
  return this.protocol_content_dict[proto_param]["show_error_message"]
}

protocol_error_message(proto_param:string): string {
  return this.protocol_content_dict[proto_param]["error_message"]
}



display_protocol_modifier_error_message(proto_param:string): boolean {
  return this.protocol_content_modifier_dict[proto_param]["show_error_message"]
}

get_protocol_modifier_error_message(proto_param:string): string {
  return this.protocol_content_modifier_dict[proto_param]["error_message"]
}

on_selection_change(proto_param:any) {
  this.protocol_content_dict[proto_param]['show_content_modifier_table'] = false
}

show_protocol_content_modifier_table(proto_param:any) {
  this.protocol_content_dict[proto_param]['show_content_modifier_table'] = true
}

display_protocol_content_modifier_table(proto_param:any): boolean {
  return this.protocol_content_dict[proto_param]['show_content_modifier_table']
}

display_protocol_add_content_modifier_button(field:any): boolean {
  if(this.json_keyword[field].hasOwnProperty("supported_content_modifier") 
  && this.json_keyword[field]["supported_content_modifier"].length>0) {
    return true
  }
  return false
}

get_protocol_content_modifier_table_header(proto_param:string): string[] {
  for(let t_dict of this.protocol_json_data['protocol']) {
    if(Object.keys(t_dict).includes(proto_param)) {
      return t_dict[proto_param]["content_modifier_table_headers"]
    }
  }
  return []
}

get_user_selection_table_headers(proto_param:string): string[] {
  for(let t_dict of this.protocol_json_data['protocol']) {
    if(Object.keys(t_dict).includes(proto_param)) {
      return t_dict[proto_param]["user_selection_table_headers"]
    }
  }
  return []
}

  add_user_selected_protocol_details(proto_param:any) {

    this.protocol_content_dict[proto_param]["show_error_message"] = false
    this.protocol_content_dict[proto_param]["error_message"] = ''

    this.protocol_content_modifier_dict[proto_param]["show_error_message"] = false
    this.protocol_content_modifier_dict[proto_param]["error_message"] = ''

    if(this.validate_protocol_inputs(proto_param)) {
      this.protocol_content_dict[proto_param]["show_error_message"] = true
      this.protocol_content_modifier_dict[proto_param]["show_error_message"] = true
      return
    }

    let protocol_content_selected = this.protocol_content_dict[proto_param].selected
    let negate = this.protocol_content_dict[proto_param].negate
    let protocol_modifier_selected = this.protocol_content_modifier_dict[proto_param].selected
    let protocol_content_value = this.protocol_content_object_dict[proto_param][protocol_content_selected]
    let protocol_modifier_value = this.protocol_content_modifier_object_dict[proto_param][protocol_modifier_selected]

    //console.log(proto_param, protocol_content_selected, protocol_content_value, negate, protocol_modifier_selected, protocol_modifier_value)
    
    if(protocol_content_selected !== undefined || protocol_content_selected !== '') {
      this.user_selected_protocol_details[proto_param]["rows"].push([protocol_content_selected, 
        protocol_content_value, protocol_modifier_selected, protocol_modifier_value, negate])
      if(protocol_modifier_selected === undefined) {
        this.user_selected_protocol_details[proto_param]["display"].push([protocol_content_selected, 
          JSON.stringify(protocol_content_value), '', '', negate])
      
      } else {
        if(protocol_modifier_value === undefined) {
          this.user_selected_protocol_details[proto_param]["display"].push([protocol_content_selected, 
            protocol_content_value, protocol_modifier_selected, '', negate])
        } else {
          this.user_selected_protocol_details[proto_param]["display"].push([protocol_content_selected, 
            protocol_content_value, protocol_modifier_selected, JSON.stringify(protocol_modifier_value), negate])
        }

      }
    }
  
  this.process_protocol_dict()
}

validate_protocol_inputs(proto_param:string): boolean {
  let protocol_content_selected = this.protocol_content_dict[proto_param].selected
  let protocol_modifier_selected = this.protocol_content_modifier_dict[proto_param].selected
  let protocol_content_value = this.protocol_content_object_dict[proto_param][protocol_content_selected]
  let protocol_modifier_value = this.protocol_content_modifier_object_dict[proto_param][protocol_modifier_selected]


  if(!this.json_keyword[protocol_content_selected].hasOwnProperty("is_mandatory") && !this.json_keyword[protocol_content_selected].hasOwnProperty("mandatory_option")) {
    if(protocol_content_value === undefined || protocol_content_value === '') {
      this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_content_selected
      return true
    }
    if(this.get_object_type(protocol_content_value) === 'array'){
      if(protocol_content_value.length === 0) {
        this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_content_selected
        return true
      }
    }

    if(this.get_object_type(protocol_content_value) === 'dict'){
      if(Object.keys(protocol_content_value).length === 0) {
        this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_content_selected
        return true
      }
    }

  }
  if(this.json_keyword[protocol_content_selected].hasOwnProperty("is_mandatory") && this.json_keyword[protocol_content_selected]["is_mandatory"]) {
    if(protocol_content_value === undefined || protocol_content_value === '') {
      this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_content_selected
      return true
    }
  }
  if(this.json_keyword[protocol_content_selected].hasOwnProperty("mandatory_option")) {
    if( protocol_content_value=== undefined || protocol_content_value === '') {
      this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_content_selected
      return true
    } else if( Object.keys(protocol_content_value).length === 0) { 
      this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + JSON.stringify(this.json_keyword[protocol_content_selected]["mandatory_option"]) + " of " + protocol_content_selected 
      return true
    } else {
      let temp_error_list:any = []
      for(let field of this.json_keyword[protocol_content_selected]["mandatory_option"]) {
        if(this.get_order_name_html_type(protocol_content_selected, field) == 'check_box_list') {
          if(protocol_content_value[field].length === 0) {
            temp_error_list.push(field)
          } 
        } else {
          if(protocol_content_value[field] === undefined || protocol_content_value[field] === '') {
            temp_error_list.push(field)
          }
        }
      }
      if(temp_error_list.length > 0) {
        this.protocol_content_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + temp_error_list.join(',')
        return true
      }
    }
  }


// this is for protocol content modifier


if(protocol_modifier_selected !== undefined){

    if(!this.json_keyword[protocol_modifier_selected].hasOwnProperty("is_mandatory") && !this.json_keyword[protocol_modifier_selected].hasOwnProperty("mandatory_option")) {
      if(protocol_modifier_value === undefined || protocol_modifier_value === '') {
        this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_modifier_selected
        return true
      }
      if(this.get_object_type(protocol_modifier_value) === 'array'){
        if(protocol_modifier_value.length === 0) {
          this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_modifier_selected
          return true
        }
      }

      if(this.get_object_type(protocol_modifier_value) === 'dict'){
        if(Object.keys(protocol_modifier_value).length === 0) {
          this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_modifier_selected
          return true
        }
      }

    }
    if(this.json_keyword[protocol_modifier_selected].hasOwnProperty("is_mandatory") && this.json_keyword[protocol_modifier_selected]["is_mandatory"]) {
      if(protocol_modifier_value === undefined || protocol_modifier_value === '') {
        this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_modifier_selected
        return true
      }
    }
    if(this.json_keyword[protocol_modifier_selected].hasOwnProperty("mandatory_option")) {
      if( protocol_modifier_value=== undefined || protocol_modifier_value === '') {
        this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + protocol_modifier_selected
        return true
      } else if( Object.keys(protocol_content_value).length === 0) { 
        this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + JSON.stringify(this.json_keyword[protocol_modifier_selected]["mandatory_option"]) + " of " + protocol_modifier_selected 
        return true
      } else {
        let temp_error_list:any = []
        for(let field of this.json_keyword[protocol_modifier_selected]["mandatory_option"]) {
          if(this.get_order_name_html_type(protocol_modifier_selected, field) == 'check_box_list') {
            if(protocol_modifier_value[field].length === 0) {
              temp_error_list.push(field)
            } 
          } else {
            if(protocol_modifier_value[field] === undefined || protocol_modifier_value[field] === '') {
              temp_error_list.push(field)
            }
          }
        }
        if(temp_error_list.length > 0) {
          this.protocol_content_modifier_dict[proto_param]["error_message"] = "** Please specify the mandatory value for " + temp_error_list.join(',')
          return true
        }
      }
    }
}
  return false
}

get_user_selected_protocol_details_rows_for_table(proto_param:any) {
  return this.user_selected_protocol_details[proto_param]["display"]
}

show_user_selected_table(proto_param:any): boolean {
  if(this.user_selected_protocol_details[proto_param]["display"].length > 0) {
    return true
  }
  return false
}

do_show_negate_for_protocol(field:any): boolean {
  return true
}

reset_protocol_object_dict(proto_param:any) {
  this.protocol_content_modifier_dict[proto_param]["selected"] = undefined

  this.protocol_content_object_dict = {}
  this.protocol_content_modifier_object_dict = {}

  //this.prepare_protocol_content_dict()
  this.prepare_protocol_content_modifier_dict()
  this.populate_protocol_object_dict()
}


remove_user_selection_entry(index:any, proto_param:any) {
  this.user_selected_protocol_details[proto_param]["rows"].splice(index, 1)
  this.user_selected_protocol_details[proto_param]["display"].splice(index, 1)
  //TODO process protocol
  //console.log(this.user_selected_protocol_details)
  this.process_protocol_dict()
}


process_protocol_dict() {
  let temp_list:any = []

  for(let proto_param of Object.keys(this.user_selected_protocol_details)) {
    temp_list.push(...this.user_selected_protocol_details[proto_param]["rows"])
  }

  if(this.dynamicForm.contains("protocol")) {
    this.dynamicForm.removeControl("protocol")
  }
  
  this.dynamicForm.addControl('protocol', this.formBuilder.control(temp_list))

  console.log(this.dynamicForm.value)
}

add_meta_keyword(){
  this.disable_meta_keyword = true
  this.show_meta_keyword_table = true
}

get_meta_keyword_header_names(): string[] {
  return this.protocol_json_data["meta_keyword"]["supported_options_table_headers"]
}

get_meta_keyword_supported_option(): string[] {
  return this.protocol_json_data["meta_keyword"]["supported_options"]
}

add_user_selected_meta_keyword(field:any) {
  this.user_selected_meta_keyword["rows"].push([field, this.meta_keyword_object_dict[field]])
  if(this.meta_keyword_object_dict[field] !== undefined) {
    this.user_selected_meta_keyword["display"].push([field, JSON.stringify(this.meta_keyword_object_dict[field])])
  } else {
    this.user_selected_meta_keyword["display"].push([field, ''])
  }
  //console.log(this.user_selected_meta_keyword)
  this.process_user_selected_metakeyword()
  }
  
 remove_user_selected_metakeyword(index:any) {
  this.user_selected_meta_keyword["rows"].splice(index, 1)
  this.user_selected_meta_keyword["display"].splice(index, 1)

  //console.log(this.user_selected_meta_keyword)
  this.process_user_selected_metakeyword()
 }

 process_user_selected_metakeyword() {
  if(this.dynamicForm.contains("meta_keyword")) {
    this.dynamicForm.removeControl("meta_keyword")
  }
  
  this.dynamicForm.addControl('meta_keyword', this.formBuilder.control(this.user_selected_meta_keyword["rows"]))
  //console.log(this.dynamicForm.value)
 }

 show_user_selected_meta_keyword_table(): boolean {
  if(this.user_selected_meta_keyword["rows"].length > 0) {
    return true
  }
  return false
 }

  get_user_selection_table_headers_for_meta_keyword(): string[] {
   return this.protocol_json_data["meta_keyword"]["user_selection_table_headers"]
  }

  get_user_selected_meta_keyword(): string[] {
    return this.user_selected_meta_keyword["display"]
  }


  generate_suricata_rules() {
    
    let dictionary = this.dynamicForm.value
     if(dictionary["content_modifier"].length>0) {
      this.generate_content_modifier_rules()
     }
  }

  generateNumberedList(ruleList:any): string {
    let numberedString = '';
    ruleList.forEach((item:any, index:any) => {
      numberedString += `${index + 1}. ${item}\n`;
    });
    return numberedString;
  }

  get_string(key:any, value:any, negate:boolean = false): string {
    let temp_string = ''
    let key_value_separator= ':'
    let value_seperator = ','
    let negate_string = ''
    let value_in_double_quotes = false

    if(negate) {
      negate_string = '!'
    }

    //common part to handle
    if(this.json_keyword[key]["key_value_separator"]) {
      key_value_separator = this.json_keyword[key]["key_value_separator"]
    }

    if(this.json_keyword[key].hasOwnProperty("value_in_double_quotes") && !this.json_keyword[key]["value_in_double_quotes"]) {
      value_in_double_quotes = false
    }

    if(this.json_keyword[key]["value_seperator"]) {
      value_seperator = this.json_keyword[key]["value_seperator"]
    }


    if(this.get_html_tag_type(key) === 'na') {
      //save_user_input_with_prefix_as
      if(this.json_keyword[key].hasOwnProperty("save_user_input_with_prefix_as")) {
        temp_string = this.json_keyword[key]["save_user_input_with_prefix_as"][key]
      } else {
        temp_string = key
      }
      
    }

    if(this.get_html_tag_type(key) === 'text' || this.get_html_tag_type(key) === 'drop_down' ) {
      let t_value = value
      if(this.json_keyword[key].hasOwnProperty("save_user_input_with_prefix_as")) {
        t_value = this.json_keyword[key]["save_user_input_with_prefix_as"][key] + ' ' + value
      }
      if(value_in_double_quotes) {
        temp_string = key + key_value_separator + negate_string + '"' + t_value + '"'
      } else {
        temp_string = key + key_value_separator + negate_string + t_value 
      }
    }

    if(this.get_html_tag_type(key) === 'check_box') {
      if(typeof value === 'boolean') {
        if(value) {
          temp_string = key
        } else {
          temp_string = ''
        }
      } 

      if(typeof value === 'string') {
        if(key === value) {
          temp_string = key
        } else {
          temp_string = ''
        }
      } 
    }

    if(this.get_html_tag_type(key) === 'check_box_list') {
      let t_str = ''

      if(this.get_object_type(value) === 'string') {
        t_str = value
      }
      if(this.get_object_type(value) === 'array') {
        t_str = value.join(value_seperator)
      }

      if(this.json_keyword[key].hasOwnProperty("save_user_input_with_prefix_as")) {
        t_str = this.json_keyword[key]["save_user_input_with_prefix_as"][key] + ' ' + t_str
      }

      if(value_in_double_quotes) { 
        temp_string = key + key_value_separator + negate_string + '"' + t_str + '"'
      } else {
        temp_string = key + key_value_separator + negate_string + t_str 
      }
    }

    if(this.get_html_tag_type(key) === 'ordered_tag_mandatory_optional') {
      let t_string_list = []
      if(this.json_keyword[key].hasOwnProperty("save_user_input_with_prefix_as")) { 
        for(let oName of this.get_order_name_list(key)) {
          if(value.hasOwnProperty(oName) && value[oName] !== undefined) {
            if(this.json_keyword[key]["save_user_input_with_prefix_as"][oName]){
              if(typeof value[oName] === 'boolean') {
                t_string_list.push(this.json_keyword[key]["save_user_input_with_prefix_as"][oName] + ' ' + oName)
              } else {
                t_string_list.push(this.json_keyword[key]["save_user_input_with_prefix_as"][oName] + ' ' + value[oName])
              }
             
            } else {
              if(typeof value[oName] === 'boolean') {
                t_string_list.push(oName)
              } else {
                t_string_list.push(value[oName])
              }
              
            }
          }
        }
      } else {
        for(let oName of this.get_order_name_list(key)) {
          if(value.hasOwnProperty(oName) && value[oName] !== undefined) {
            t_string_list.push(value[oName])
          }
        }
      }

      if(value_in_double_quotes) { 
        temp_string = key +  key_value_separator + negate_string + '"' + t_string_list.join(value_seperator) + '"'
      } else {
        temp_string = key +  key_value_separator + negate_string + t_string_list.join(value_seperator)
      }

      
    }

    return temp_string

  }

  
  generate_content_modifier_rules() {
    this.final_suricata_rule_list = []
    let temp_dict:any = {}
    let temp_rule_content_string_part:any = {}

    let temp_rule_string = ''
    let meta_keyword_string = ''
    let dictionary = this.dynamicForm.value
    let common_list = [dictionary["common_field"]['action'],  this.check_protocol.toLowerCase(),
     dictionary["common_field"]['source_ip'], dictionary["common_field"]['source_port'], dictionary["common_field"]['flow_direction'], 
     dictionary["common_field"]['destination_ip'], dictionary["common_field"]['destination_port']]
     temp_rule_string += common_list.join(" ") + ' ( msg: "' + dictionary["common_field"]["msg"] + '";'
     let end_string = ';)'
    
     if(this.dynamicForm.value.hasOwnProperty("meta_keyword") && this.dynamicForm.value["meta_keyword"].length>0) {
      let meta_temp_list = []
      for(let mk of this.dynamicForm.value["meta_keyword"]) {
        meta_temp_list.push(this.get_string(mk[0], mk[1]))
      }

      meta_keyword_string = meta_temp_list.join(';')
     }
     
    for(let cm of this.dynamicForm.value["content_modifier"]) {
      let negate_string = ''
      let cm_string = ''
      let final_rule = ''
      let cont_mod_string = this.get_string(cm["content_modifer"], cm["content_modifier_obj"])
      if(cm["negate"]) {
        negate_string = "!" 
      }
      cm_string = "content:" + negate_string + '"' + cm["content_string"] + '";'
      if(meta_keyword_string === '') {
        final_rule = temp_rule_string + cm_string + cont_mod_string + end_string
        this.final_suricata_rule_list.push(final_rule)
      } else {
        final_rule = temp_rule_string + cm_string + cont_mod_string +';' + meta_keyword_string + end_string
        this.final_suricata_rule_list.push(final_rule)
      }
      

      let check_string = cm_string+'_' + cm["negate"].toString()
      if(!temp_dict.hasOwnProperty(check_string)) {
        temp_dict[check_string] = []
        temp_dict[check_string].push(cont_mod_string)
      } else {
        temp_dict[check_string].push(cont_mod_string)
      }

      if(!temp_rule_content_string_part.hasOwnProperty(check_string)) {
        temp_rule_content_string_part[check_string] = cm_string
      }
    }

    for(let k of Object.keys(temp_dict)) {
      let final_rule = ''
      if(temp_dict[k].length>1) {
        if(meta_keyword_string === '') {
          final_rule = temp_rule_string + temp_rule_content_string_part[k] + temp_dict[k].join(';') + end_string
          this.final_suricata_rule_list.push(final_rule)
        } else {
          final_rule = temp_rule_string + temp_rule_content_string_part[k] + temp_dict[k].join(';') +';' + meta_keyword_string+ end_string
          this.final_suricata_rule_list.push(final_rule)
        }
        
      }
    }
    

    }
  
  async checkRules() {
    this.final_suricata_rule_check_status_list = []
    if(this.final_suricata_rule_list.length > 0) {
      for (const [index, rule] of this.final_suricata_rule_list.entries()) {
        let timeout = 15000
        
        //let t = this.checkGeneratedSuricataRule(rule, index+1)
        let check_url='http://' + this.server + '/validate_rule?check_rule=' + rule
        console.log(check_url)

        const request = await axios.get(check_url);

        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timed out'));
          }, timeout);
        });

      Promise.race([request, timeoutPromise])
      .then((response: AxiosResponse) => {
        console.log(response.data);
          let text = response.data['error'];
          let pattern = /rule \d/i;
          let rule_index = index + 1
          let replacedText = text.replace(pattern, 'Rule ' + rule_index);
          /* 
          1. Rule is OK
  2. Issue in the rule.  Rule 2 mixes keywords with conflicting directions
  3. Issue in the rule.  Rule 3 setup buffer http_uri but didn't add matches to it  
          */
          let error_string_1 = 'mixes keywords with conflicting directions'
          const regex = new RegExp(error_string_1);

          if (regex.test(replacedText)) {
            replacedText += ". Possible corrective action to check flow selection"
          }



          this.final_suricata_rule_check_status_list.push(replacedText)
      }).catch((error: Error) => {
        throw error;
      });

      }
      console.log(this.final_suricata_rule_check_status_list)
    }
  }

    
     
  


}

