
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

@Component({
  selector: 'app-tcp',
  templateUrl: './tcp.component.html',
  styleUrls: ['./tcp.component.css']
})
export class TcpComponent implements OnInit {
  @Input() check_protocol = '';
  @Input() check_url = '';

  //selectedOption!: string;

  server = "10.203.38.232:9000"

  protocol=''
  jsonData_keyword: any = [];
  jsonData_http3: any = [];
  url_keyword: string = '../assets/keyword.json';
  url_http: string = ""
  dynamicForm!: FormGroup;
  specialCharacterPattern = /[!@#$%^&*(),?":{}|<>]/;
  final_suricata_rule_list:any = []
  final_suricata_rule_check_status_list:any = []
  rule_check_status:string = ''
  submit_button:string = ''

  //common part
  common_part_error_message_dict:any = {}


  // CONTENT MODIFIER PART START HERE
  //Below variables are use for content match field
  showContentMatchTextBox:boolean = false
  disabledContentMatchButton: boolean = false
  showContentMatchTable: boolean = false
  content_dict = {
    "content_modifier_select": undefined,
    "content_modifier_text_data": undefined,
    "content_modifier_text_filter_data": undefined,
    "content_modifier_check_box": undefined,
    "content_modifier_order_tag_select1": undefined,
    "content_modifier_order_tag_text_filter_data": undefined,
    "content_modifier_order_tag_select2": undefined,
    "content_modifier_negate": false
  }
  content_match_text_box:string ='';

  // This dict is for handling content modifier part
  global_content_modifier_dict:any = {}
  content_modifier_error_count=0
  content_modifier_error_message=""
  content_modifier_showErrorMessage=false

  global_content_modifier_final_dict:any = {}
  content_modifier_order_tag_dict:any = {}
  showcontentTable:boolean = false

// CONTENT MODIFIER PART END HERE

  constructor(
    private jsonService: JsonReaderService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private sharedService: SharedService,
    private location: Location,
    private router: Router
  ) {
    //console.log("constructor")
    this.dynamicForm = this.formBuilder.group({});

  }


  ngOnChanges() {
    this.protocol = ''
    this.url_http = ''
    this.dynamicForm.reset()

    this.sharedService.getData().subscribe(data => {
      console.log("ngit service")
      this.check_protocol = data.protocol.toLowerCase();
      this.check_url = data.check_url;
      console.log(this.check_protocol)
      console.log(this.check_url)
    });

    this.protocol = this.check_protocol
    this.url_http = this.check_url
    // Refresh logic goes here
    //console.log("ngchagne")
    this.jsonService.getJsonData(this.url_keyword).subscribe((data1) => {
      this.jsonData_keyword = data1;
      //TODO have to create form control
     //this.createFormControl();
    
    });

    if(this.protocol != '' || this.protocol !== undefined) {
    this.jsonService.getJsonData(this.url_http).subscribe((data2) => {
      this.jsonData_http3 = data2;
      this.createFormControlForCommonField()
      //this.createAdditionalFormControl()
      this.generateContentModifierOrdertagMandtoryDict()
      //console.log(this.content_modifier_order_tag_dict)
      this.generateErrorMeesageDictForCommonField()
      this.generateGlobalHttpDict() 
    });
  }
    //this.reloadComponent();
    this.final_suricata_rule_list = []
    this.final_suricata_rule_check_status_list = []
    
  }

  ngOnInit() {
    //console.log("ngit")
    this.protocol = this.check_protocol.toLowerCase()
    this.url_http = this.check_url
    //console.log(this.protocol)
    //console.log(this.url_http)

/*
    this.jsonService.getJsonData(this.url_keyword).subscribe((data1) => {
      this.jsonData_keyword = data1;
      //TODO have to create form control
     //this.createFormControl();
    
    });
    if(this.protocol != '' || this.protocol !== undefined) {
    this.jsonService.getJsonData(this.url_http).subscribe((data2) => {
      this.jsonData_http3 = data2;
      this.createFormControlForCommonField()
      //this.createAdditionalFormControl()
      this.generateContentModifierOrdertagMandtoryDict()
      //console.log(this.content_modifier_order_tag_dict)
      this.generateErrorMeesageDictForCommonField()
      this.generateGlobalHttpDict() 
    });
  }
  */
  }

  onSubmit() {
    console.log(this.dynamicForm.value)
    this.final_suricata_rule_list  = []
    this.final_suricata_rule_check_status_list = []
    this.generate_suricata_rule()
    this.checkRules()
  }

  createFormControlForCommonField() {
    if (this.jsonData_http3["common"]['supported_options']) {
      for (let field of this.jsonData_http3["common"]['supported_options']) {
        if (this.jsonData_keyword[field].html_tag_type == "text_with_checkbox" || this.jsonData_keyword[field].html_tag_type == "dropdown_with_text"
        || this.jsonData_keyword[field].html_tag_type == "ordered_tag" || this.jsonData_keyword[field].html_tag_type == "check_box_list" || 
        this.jsonData_keyword[field].html_tag_type == "ordered_tag_mandator_optional") {
          this.dynamicForm.addControl(field, this.formBuilder.array([]));
        } else {
          this.dynamicForm.addControl(field, new FormControl(''));
        }
      }
    }
    //console.log(this.content_modifier_order_tag_dict)
  }

  generateErrorMeesageDictForCommonField() {
    if (this.jsonData_http3["common"]['supported_options']) {
      for (let field of this.jsonData_http3["common"]['supported_options']) {
        this.common_part_error_message_dict[field] = {}
        this.common_part_error_message_dict[field]["showErrorMessage"] = false
        this.common_part_error_message_dict[field]["errorMessage"] = ''

        this.common_part_error_message_dict[field]["showHelpMessage"] = false
      }
    }
  } 

  createFormControl() {
    for (let field in this.jsonData_keyword) {      
      if (this.jsonData_keyword[field].html_tag_type == "text_with_checkbox" || this.jsonData_keyword[field].html_tag_type == "dropdown_with_text"
      || this.jsonData_keyword[field].html_tag_type == "ordered_tag") {
        this.dynamicForm.addControl(field, this.formBuilder.array([]));
      } else {
        this.dynamicForm.addControl(field, new FormControl(''));
      }
      
    }
  }

  generateContentModifierOrdertagMandtoryDict() {
    for (let option in this.jsonData_http3) {
      for(let keyname in this.jsonData_keyword) {
        if (this.jsonData_keyword[keyname].html_tag_type == "ordered_tag_mandator_optional") {
          if(! this.content_modifier_order_tag_dict[option]) {
            this.content_modifier_order_tag_dict[option] = {}
            this.content_modifier_order_tag_dict[option][keyname] = {}
          } else if (!this.content_modifier_order_tag_dict[option][keyname]) {
            this.content_modifier_order_tag_dict[option][keyname] = {}
          }
          
          for(let k of this.jsonData_keyword[keyname]["order_name"]) {
            this.content_modifier_order_tag_dict[option][keyname][k] = undefined
          }
        }
      }
   }
  }

  clearContentModifierOrdertagMandtoryDict() {
    for(let m in this.content_modifier_order_tag_dict) {
      for(let k in this.content_modifier_order_tag_dict[m]) {
        for (let l in this.content_modifier_order_tag_dict[m][k]) {
          this.content_modifier_order_tag_dict[m][k][l] = undefined
        }
      }
    }

  }

  /*
  createAdditionalFormControl() {
    this.dynamicForm.addControl("content_match_text", new FormControl(''));
  }
  */

  addContentMatch() {
    this.showContentMatchTextBox = true
    this.disabledContentMatchButton = true
    this.showContentMatchTable = true
    this.showcontentTable = true
  }

  validate_ordered_tag_mandator_optional(key:string, dict_name:string) {
    let temp_error_msg = '** Please specify mandatory option '
    let error_count = 0
    this.content_modifier_showErrorMessage = false
    if(this.jsonData_keyword[key]['mandatory_option']){
      for(let o of this.jsonData_keyword[key]['mandatory_option']) {
        if(this.content_modifier_order_tag_dict[dict_name][key][o] === '' || 
        this.content_modifier_order_tag_dict[dict_name][key][o] === undefined) {
          temp_error_msg = temp_error_msg  + o + " "
          error_count +=1
        }
      }
    }

    if(error_count>0){
      this.content_modifier_error_message = temp_error_msg
      this.content_modifier_showErrorMessage = true
    }

  }

  addContentMatchData(table_id:any, content_match:any, negate_match:any, data1:any, data2:any, data3:any, data4:any, data5:any, data6:any, data7:any) {
    //this.showcontentTable = true
    //console.log("Adding")
    //console.log(content_match, data1, data2, data3, data4, data5, data6, data7)
    //console.log(data7)
    //console.log(this.content_modifier_order_tag_dict)
    this.content_modifier_showErrorMessage = false
    let temp_string = ''
    let temp_data7 = undefined

    if(content_match=="" || content_match === undefined) {
      this.content_modifier_error_message = "** Specify content Match string"
      this.content_modifier_showErrorMessage = true
      
    } else if(data1 === undefined || data1 === '') {
      //this.content_modifier_error_message = "** Specify content Match Criteria"
      //this.content_modifier_showErrorMessage = true
    } else  if (data1 !== undefined && this.jsonData_keyword[data1].is_mandatory && (data2 === undefined  || data2 == '')) {
      this.content_modifier_error_message = "** Specify the value for " + data1
      this.content_modifier_showErrorMessage = true
    }else {
      if (this.jsonData_keyword[data1].html_tag_type =='ordered_tag_mandator_optional') {
        this.validate_ordered_tag_mandator_optional(data1, "content")
        temp_data7 = JSON.parse(JSON.stringify(data7["content"][data1]));
      }
    }

    if(!this.content_modifier_showErrorMessage) {
    /*
      data1 = matching criteria e.g. nocase, depth 
      data2 = value assiciated with matching criteria. if data2 is undefined then it is a single value like nocase, startwith
      data3 = checkbox value relative
      data4 = order_tag no_byts, operator
      data5 = value
      data6 = operator

    */

    if(!(this.global_content_modifier_dict[content_match])){
      this.global_content_modifier_dict[content_match] = {}
    }



    
    if(!(this.global_content_modifier_dict[content_match]['original_data_received'])) {
      this.global_content_modifier_dict[content_match]['original_data_received'] = []
    }
    
    this.global_content_modifier_dict[content_match]['original_data_received'].push([data1, data2, data3, data4, data5, data6, temp_data7, negate_match])
    //console.log(this.global_content_modifier_dict)

    //console.log(this.global_content_modifier_dict[content_match]['rows_to_display'])
    this.processContentModifierDictRecursively(table_id)
    this.clearContentMatchDict()
    this.clearContentModifierOrdertagMandtoryDict()
    //console.log(this.content_modifier_order_tag_dict)
    this.showcontentTable = this.doShowContentTable()
    

  }
  }


  processContentModifierDictRecursively(table_id:any) {
    this.global_content_modifier_final_dict = {}
    let key_value_seperator = ":"
    for(let row in this.global_content_modifier_dict) {
      this.global_content_modifier_dict[row]['rows_to_display'] = []

      if(!(this.global_content_modifier_final_dict[row])){
        this.global_content_modifier_final_dict[row] = {}
      }
  

      //console.log(row)
      for (let r of this.global_content_modifier_dict[row]['original_data_received']) {
        let match_criteria = r[0]
        let value_of_match_criteria = r[1]
        let is_relative = r[2]
        let order_tag_or_operator = r[3]
        let order_tag_value = r[4]
        let operator = r[5]
        let temp_order_tag = r[6]
        let negate_match = r[7]

        this.global_content_modifier_final_dict[row]["negate_match"] = negate_match



        if (match_criteria ===undefined && value_of_match_criteria === undefined && is_relative === undefined 
          && order_tag_or_operator === undefined && order_tag_value === undefined && operator === undefined) {
            //single type value is assigned.
            this.global_content_modifier_final_dict[row][match_criteria] = true
            //console.log(temp_string)
            this.global_content_modifier_dict[row]['rows_to_display'].push([row, "", negate_match])
          }

          if (match_criteria !==undefined && value_of_match_criteria === undefined && is_relative === undefined 
            && order_tag_or_operator !== undefined && order_tag_value === undefined && operator === undefined) {
              //single type value is assigned in case of dropdown with text
              this.global_content_modifier_final_dict[row][match_criteria] = order_tag_or_operator
              //console.log(temp_string)
              this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+order_tag_or_operator, negate_match])
            }
  

        if (match_criteria !==undefined && value_of_match_criteria === undefined && is_relative === undefined 
          && order_tag_or_operator === undefined && order_tag_value === undefined && operator === undefined && this.jsonData_keyword[match_criteria].html_tag_type !='ordered_tag_mandator_optional') {
            //single type value is assigned.
              this.global_content_modifier_final_dict[row][match_criteria] = true
            //console.log(temp_string)
            this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria, negate_match])
          }

          if (match_criteria !==undefined && value_of_match_criteria !== undefined && is_relative === undefined 
            && order_tag_or_operator === undefined && order_tag_value === undefined && operator === undefined) {
              // match criteria and its value is passed
              this.global_content_modifier_final_dict[row][match_criteria] = value_of_match_criteria
              this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+value_of_match_criteria, negate_match])
            }
        
          if (match_criteria !==undefined && value_of_match_criteria !== undefined && is_relative !== undefined 
            && order_tag_or_operator === undefined && order_tag_value === undefined && operator === undefined) {
              // match criteria and its value is passed and it is relateive
              if(is_relative == 'relative') {
                //this.global_content_modifier_final_dict[row][match_criteria] = [value_of_match_criteria, 'relative']
                this.global_content_modifier_final_dict[row][match_criteria] = value_of_match_criteria + ",relative"
                this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+value_of_match_criteria+'relative'], negate_match)
              }
            }


          if (match_criteria !==undefined && value_of_match_criteria !== undefined && is_relative === undefined 
            && order_tag_or_operator !== undefined && order_tag_value === undefined && operator === undefined) {
              // match criteria and its value is passed & operator is used for condition check
              if(order_tag_or_operator === 'range') {
                let myList: string[] = value_of_match_criteria.split('-')
                this.global_content_modifier_final_dict[row][match_criteria] = myList[0] + "<>" + myList[1]
                this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+myList[0] + "<>" + myList[1], negate_match])
              } else {
                if(this.jsonData_keyword[match_criteria]["key_value_seperator"]) {
                  this.global_content_modifier_final_dict[row][match_criteria] = order_tag_or_operator + this.jsonData_keyword[match_criteria]["key_value_seperator"] + value_of_match_criteria
                  this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+ order_tag_or_operator + this.jsonData_keyword[match_criteria]["key_value_seperator"] + value_of_match_criteria, negate_match])
                } else {
                  this.global_content_modifier_final_dict[row][match_criteria] = order_tag_or_operator + value_of_match_criteria
                  this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+ order_tag_or_operator + value_of_match_criteria, negate_match])
                }
                
              }
            }

          if (match_criteria !==undefined && value_of_match_criteria === undefined && is_relative === undefined 
            && order_tag_or_operator === undefined && order_tag_value === undefined && operator === undefined 
            && this.jsonData_keyword[match_criteria].html_tag_type =='ordered_tag_mandator_optional') {
              let temp_string_list: string[] = []
              let value_seperator = ","
              if (this.jsonData_keyword[match_criteria]["value_seperator"]) {
                value_seperator = this.jsonData_keyword[match_criteria]["value_seperator"]
              }
              // match criteria and doesnot contain value & contain the order tag value
              for(let orderName of this.jsonData_keyword[match_criteria]['order_name']) {
                if (temp_order_tag[orderName] !== undefined && temp_order_tag[orderName] != '') {
                  if(this.jsonData_keyword[match_criteria]["save_user_input_with_prefix_as"]) {
                    if(this.jsonData_keyword[match_criteria]["save_user_input_with_prefix_as"][orderName]) {
                      temp_string_list.push(this.jsonData_keyword[match_criteria]["save_user_input_with_prefix_as"][orderName] + temp_order_tag[orderName])
                    } else {
                      temp_string_list.push(temp_order_tag[orderName])
                    }
                  } else {
                    temp_string_list.push(temp_order_tag[orderName])
                  }
                  
                }
              }

              this.global_content_modifier_final_dict[row][match_criteria] = temp_string_list.join(value_seperator)
              this.global_content_modifier_dict[row]['rows_to_display'].push([row, match_criteria+':'+temp_string_list.join(value_seperator), negate_match])
              }


      }
    }
    console.log(this.global_content_modifier_dict)
    this.updateTheFormControl(table_id)
  }


  removeFormControl(name:string) {
    if(this.dynamicForm.contains(name)) {
      this.dynamicForm.removeControl(name)
    }
  }
    

  updateTheFormControl(name:string) {
    if(this.dynamicForm.contains("content_modifier")) {
      this.dynamicForm.removeControl("content_modifier")
    }
    
    let temp_list: string[] = []
    if(name=='content') {
      //this.global_content_modifier_final_dict
      for (let k in this.global_content_modifier_final_dict) {
        if(this.global_content_modifier_final_dict[k]["negate_match"]) {
          temp_list.push("content:"+ "!" + this.normalizeTheContentString(k))
        } else {
          temp_list.push("content:"+ this.normalizeTheContentString(k))
        }
        
        for(let cn_l of this.jsonData_http3["content"]["supported_options"]) {
          if(this.global_content_modifier_final_dict[k][cn_l]) {
            if(this.jsonData_keyword[cn_l].html_tag_type=='na' && this.global_content_modifier_final_dict[k][cn_l] 
            && this.global_content_modifier_final_dict[k][cn_l]!==undefined && this.global_content_modifier_final_dict[k][cn_l] != '') {
              temp_list.push(cn_l)
            } else {
              temp_list.push(cn_l + ':' + this.global_content_modifier_final_dict[k][cn_l] )
            }
          }
        }

      }
    if(temp_list.length>0) {
      this.setValueInFormControl("content_modifier", temp_list)
    }
    
    }
  }

  doShowContentTable(): boolean{
    const keys = Object.keys(this.global_content_modifier_dict);
    const length = keys.length;
    if (length > 0) {
      for (let k of keys) {
        if(this.global_content_modifier_dict[k]['rows_to_display'] && this.global_content_modifier_dict[k]['rows_to_display'].length > 0) {
          return true
        }
      }
    }
    return false
  }

  removeElementAt(content_match:any, index:any, dict_name:any) {
    console.log(content_match,index)
    this.global_content_modifier_dict[content_match]["original_data_received"].splice(index, 1)
    if(this.global_content_modifier_dict[content_match]["original_data_received"].length==0) {
      delete this.global_content_modifier_dict[content_match]
    }
    this.processContentModifierDictRecursively(dict_name)
  }

  clearContentMatchDict() {
    this.content_dict["content_modifier_select"] = undefined
    this.content_dict["content_modifier_text_data"] = undefined
    this.content_dict["content_modifier_text_filter_data"] = undefined
    this.content_dict["content_modifier_check_box"] = undefined
    this.content_dict["content_modifier_order_tag_select1"] = undefined
    this.content_dict["content_modifier_order_tag_text_filter_data"] = undefined
    this.content_dict["content_modifier_order_tag_select2"] = undefined
    this.content_dict.content_modifier_negate = false
  }

  clearContentMatchDict2() {
    this.content_dict["content_modifier_text_data"] = undefined
    this.content_dict["content_modifier_text_filter_data"] = undefined
    this.content_dict["content_modifier_check_box"] = undefined
    this.content_dict["content_modifier_order_tag_select1"] = undefined
    this.content_dict["content_modifier_order_tag_text_filter_data"] = undefined
    this.content_dict["content_modifier_order_tag_select2"] = undefined
  }

  getDictionaryKeys(dictionary: { [key: string]: any }): string[] {
    return Object.keys(dictionary);
  }



  
  setValueInFormControl(controlName:any, newValue:any) {
    if(!this.dynamicForm.get(controlName)) {
      this.dynamicForm.addControl(controlName, new FormControl(''));
    } 
    const formControl = this.dynamicForm.get(controlName) as FormControl;
    formControl.setValue(newValue);
    
  }

  getIndexOfOrderTag(key:string, value:string) {
    return this.jsonData_keyword[key]["order_name"].indexOf(value)
  }

  handleCheckboxChange(event: any, formarrayname:any) {
    const checkboxesArray = this.dynamicForm.get(formarrayname) as FormArray;

    if (event.target.checked) {
      checkboxesArray.push(this.formBuilder.control(event.target.value));
    } else {
      const index = checkboxesArray.controls.findIndex(x => x.value === event.target.value);
      checkboxesArray.removeAt(index);
    }
  }

  handleSingleCheckboxClick(event: any, value:any) {
    if (event.target.checked) {
      this.content_dict.content_modifier_check_box= value;
    } else {
      this.content_dict.content_modifier_check_box = undefined;
    }
  }

  negateContentModifierContent(event: any) {
    if (event.target.checked) {
      this.content_dict.content_modifier_negate= true;
    } else {
      this.content_dict.content_modifier_negate = false;
    }
    console.log(this.content_dict)
  }


  handleSingleCheckboxClickForOrdgerTag(event: any, value:any, dict_name:any, content_match_name:any) {
    if (event.target.checked) {
      this.content_modifier_order_tag_dict[dict_name][content_match_name][value] = value;
    } else {
      this.content_modifier_order_tag_dict[dict_name][content_match_name][value] = undefined;
    }

  }

  hideTable(table_name:any) {
    if(table_name == 'content') {
      this.showcontentTable = false
      this.showContentMatchTable = false
      this.disabledContentMatchButton = false
    }
  }


/* ************************************
* This section is to handle the http request and response section
* ***********************************
*/

globalHttpDict:any = {}
httpNgModelSelectDict:any = {}
data_parameter:string[] = ['http_request_parameters', 'http_response_parameters', 'tcp_parameters', 'meta_keyword']
dataDict:any = {}


generate_content_modifier_for_html(){
  for(let h in this.jsonData_http3) {
    if(h == "common" || h=="content") {
      continue
    }
    this.globalHttpDict[h]["select_supported_content_modifier"] = undefined
    this.httpNgModelSelectDict[h] = undefined
    this.globalHttpDict[h]["supported_content_modifier"] = {}

    if(this.jsonData_http3[h]['supported_options']){
    for(let k of this.jsonData_http3[h]['supported_options']) {
      // if key does not content the supported modifier
      this.globalHttpDict[h][k] = {}
      if(this.jsonData_keyword[k]["html_tag_type"]==="ordered_tag_mandator_optional") {
        for(let oname of this.jsonData_keyword[k]["order_name"]) {
          this.globalHttpDict[h][k][oname] = undefined
        }
      } else if(this.jsonData_keyword[k]["html_tag_type"]==="text_with_checkbox") {
        this.globalHttpDict[h][k]['text'] = undefined
        this.globalHttpDict[h][k]['check_box_value'] = undefined
      } else if(this.jsonData_keyword[k]["html_tag_type"]==="dropdown_with_text") { 
        this.globalHttpDict[h][k]['text'] = undefined
        this.globalHttpDict[h][k]['selected'] = undefined
      } else if(this.jsonData_keyword[k]["html_tag_type"]==="text") { 
        this.globalHttpDict[h][k]['text'] = undefined
      }
      
      if(this.jsonData_keyword[k]["supported_content_modifier"]) {
        for (let scm of this.jsonData_keyword[k]["supported_content_modifier"]) {
          if(this.jsonData_keyword[scm]["html_tag_type"]==="ordered_tag_mandator_optional"){
            this.globalHttpDict[h]["supported_content_modifier"][scm] = {}
            for(let oname of this.jsonData_keyword[scm]["order_name"]) {
              this.globalHttpDict[h]["supported_content_modifier"][scm][oname] = undefined
            }
          } else if(this.jsonData_keyword[scm]["html_tag_type"]==="text_with_checkbox") {
            this.globalHttpDict[h]["supported_content_modifier"][scm] = {}
            this.globalHttpDict[h]["supported_content_modifier"][scm]['text'] = undefined
            this.globalHttpDict[h]["supported_content_modifier"][scm]['check_box_value'] = undefined
          } else if(this.jsonData_keyword[scm]["html_tag_type"]==="dropdown_with_text") {
            this.globalHttpDict[h]["supported_content_modifier"][scm] = {}
            this.globalHttpDict[h]["supported_content_modifier"][scm]['text'] = undefined
            this.globalHttpDict[h]["supported_content_modifier"][scm]['selected'] = undefined
          }
          else {
            this.globalHttpDict[h]["supported_content_modifier"][scm] = undefined
          }
         
        }
      }
      
    }
  }
  }
}

generateGlobalHttpDict() {
  for(let h in this.jsonData_http3) {
    if(h == "common" || h=="content") {
      continue
    }
    this.dataDict[h] = {}
    this.dataDict[h]['rows_to_display'] = []
    this.dataDict[h]['showDataTable'] = false


    this.globalHttpDict[h] = {}
    this.globalHttpDict[h]['showTable'] = false
    this.globalHttpDict[h]['showContentModifierTable'] = false
    this.globalHttpDict[h]['showErrorMessage'] = false
    this.globalHttpDict[h]['errorMessage'] = ''
    this.globalHttpDict[h]['negate_match'] = false
  }

  this.generate_content_modifier_for_html()

  console.log("global data dict")
  //console.log(this.dataDict)
  console.log(this.globalHttpDict)
}

displayHttpContentTable(table_id:any) {
  this.globalHttpDict[table_id]['showTable'] = true
}

negate_http_content(event:any, http_options:any) {
  if (event.target.checked) {
    this.globalHttpDict[http_options].negate_match= true;
  } else {
    this.globalHttpDict[http_options].negate_match= false;
  }
}


addHttpContentModifier(http_options_tabel:any, options:any) {
  /*
  for(let h of this.data_parameter) {
    this.globalHttpDict[h]['showErrorMessage'] = false
    this.globalHttpDict[h]['errorMessage'] = ''
  }
  */

  for(let h in this.jsonData_http3) {
    if(h == "common" || h=="content") {
      continue
    } else {
      this.globalHttpDict[h]['showErrorMessage'] = false
      this.globalHttpDict[h]['errorMessage'] = ''
    }
  }

  if(options === undefined || options =='') {
    this.globalHttpDict[http_options_tabel]['showErrorMessage'] = true
    this.globalHttpDict[http_options_tabel]['errorMessage'] = 'Value cannot be empty'

  }

  if(!(this.globalHttpDict[http_options_tabel]['showErrorMessage'])) {
    this.globalHttpDict[http_options_tabel]['showContentModifierTable'] = true
  }
  
}

onSelectionChange(http_options:any) {
  this.globalHttpDict[http_options]['showContentModifierTable'] = false
  this.globalHttpDict[http_options].select_supported_content_modifier = undefined
}

handleSingleCheckboxClickForData(event: any, value:any, http_options:any, modifier_name:any, modifier_attribute:any) {
  console.log(event.target.checked, value, http_options, modifier_name, modifier_attribute)
  if (event.target.checked) {
    this.globalHttpDict[http_options]["supported_content_modifier"][modifier_name][modifier_attribute] = value
  } else {
    this.globalHttpDict[http_options]["supported_content_modifier"][modifier_name][modifier_attribute] = undefined
  }
  console.log(this.globalHttpDict)
}

addAndCreateFormControl(http_options:any, option1:any, option2:any, option3:any, option4:any, negate_match:any) {
  this.globalHttpDict[http_options]['showErrorMessage'] = false
  this.globalHttpDict[http_options]['errorMessage'] = ''

  console.log(http_options, option1, option2, option3, option4, negate_match)
  let rc:boolean = this.validateDataInput(http_options, option1, option2, option3, option4)
  if(rc) {
    if(!(this.dataDict[http_options]["original_received_Data"])) {
      this.dataDict[http_options]["original_received_Data"] = []
    }
    if(typeof option4 === 'object') {
      this.dataDict[http_options]["original_received_Data"].push([http_options, option1, option2, option3, JSON.parse(JSON.stringify(option4)), negate_match])
    } else {
      this.dataDict[http_options]["original_received_Data"].push([http_options, option1, option2, option3, option4, negate_match])
    }
    
  
    
    console.log("HTTP DATA DICT")
    console.log(this.dataDict)

    if (this.protocol.toLowerCase() == 'http'){

    }
    this.processDataDict() 
    //this.clear_selected_option(http_options)
    
  }

}



validateDataInput(http_options:any, option1:any, option2:any, option3:any, option4:any): boolean {
  if(this.jsonData_keyword[option1]["html_tag_type"] == 'na') {
    if(option2 !== undefined && option3 !== undefined && option3 !== undefined) {
      this.globalHttpDict[http_options]['showErrorMessage'] = true
      this.globalHttpDict[http_options]['errorMessage'] = 'Value should be empty'
      return false
    }
    return true
  } 
  if (this.jsonData_keyword[option1]["html_tag_type"] != 'ordered_tag_mandator_optional') {
    if(option2 === undefined) {
      this.globalHttpDict[http_options]['showErrorMessage'] = true
      this.globalHttpDict[http_options]['errorMessage'] = 'Value for '+ option1 + ' cannot be empty'
      return false
    }
  } 
  if (option3 !== undefined && option3 !='') {
    if(this.jsonData_keyword[option3]["html_tag_type"] == 'na') {
      if(option4 !== undefined && option4 != '') {
        this.globalHttpDict[http_options]['showErrorMessage'] = true
      this.globalHttpDict[http_options]['errorMessage'] = "Value should be empty for " + option3
      }
      return true
    }
    if(typeof option4 !== 'object' && (option4 == '' || option4 === undefined)) {
      this.globalHttpDict[http_options]['showErrorMessage'] = true
      this.globalHttpDict[http_options]['errorMessage'] = 'Value for '+ option3 + ' cannot be empty'
      return false
    } 
    //for ordered_tag_mandator_optional
    let temp_error_msg = 'Please specify mandatory option '
    let error_count = 0
    this.content_modifier_showErrorMessage = false
    if(this.jsonData_keyword[option3]['mandatory_option']){
      for(let o of this.jsonData_keyword[option3]['mandatory_option']) {
        if(option4[o] === '' || 
          option4[o] === undefined) {
          temp_error_msg = temp_error_msg  + o + " "
          error_count +=1
        }
      }
    }

    if(error_count>0){
      this.globalHttpDict[http_options]['showErrorMessage'] = true
      this.globalHttpDict[http_options]['errorMessage'] = temp_error_msg
      return false
    }
  }
  return true
}

processDataDict() {
  let temp_dict:any = {}

  for(let http_options in this.dataDict) {
    this.dataDict[http_options]['rows_to_display'] = []
    if(this.dataDict[http_options]["original_received_Data"] && this.dataDict[http_options]["original_received_Data"].length >0) {
      if(! temp_dict[http_options]) {
        temp_dict[http_options] ={}
      }
      for (let row of this.dataDict[http_options]["original_received_Data"]) {
        let ho = row[0]
        let supp_option = row[1]
        let content_match = row[2]
        let content_modifier = row[3]
        let content_modifier_value = row[4]
        let negate_match = row[5]
        let negate_char = ''
        let new_normalized_string = ''

        if(negate_match) {
          negate_char = '!'
        }

        if(! temp_dict[http_options][supp_option]) {
          temp_dict[http_options][supp_option] ={}
        }

        if(this.jsonData_keyword[supp_option]["no_content"]) {
          temp_dict[http_options][supp_option] ={}
        } 

        if(! temp_dict[http_options][supp_option][content_match]) {
          temp_dict[http_options][supp_option][content_match] ={}
          temp_dict[http_options][supp_option][content_match]["dict"] ={}
          temp_dict[http_options][supp_option][content_match]["rows"] = []
        }

        if (typeof content_match === 'string') { 
          if(this.isValueRequiredInDoubleQuotes(supp_option)) { 
            new_normalized_string = this.normalizeTheContentString(content_match, true)
          } else {
            new_normalized_string = this.normalizeTheContentString(content_match, false)
          }
        } else if (typeof content_match === 'object') { 
          let value_seperator = ''
          let t_l = []
          if(this.jsonData_keyword[supp_option]["html_tag_type"] === "dropdown_with_text") {
            let skip_nr: boolean = false
            
            if(this.jsonData_keyword[supp_option]["value_separator"]) {
              value_seperator = this.jsonData_keyword[supp_option]["value_separator"]
            }
            if(this.jsonData_keyword[supp_option]["order_name"]) {
              
              for (let ord of this.jsonData_keyword[supp_option]["order_name"]) {
                if(ord==='selected' && content_match[ord] === 'range') {
                  let min = content_match["text"].split('-')[0]
                  let max = content_match["text"].split('-')[1]
                  //t_l.push(min+'<>'+max)
                  new_normalized_string = min+'<>'+max
                  skip_nr = true
                  break
                } else {
                  t_l.push(content_match[ord])
                }
                
              }
              if(! skip_nr) {
                new_normalized_string = t_l.join(value_seperator)
              }
              
            }
          } else {
            if(content_match["selected"] === 'range') {
              let min = content_match["text"].split('-')[0]
              let max = content_match["text"].split('-')[1]
              t_l.push(min+'<>'+max)
              new_normalized_string = t_l.join(value_seperator)
            } else {
              t_l.push(content_match["selected"])
              t_l.push(content_match["text"])
              new_normalized_string = t_l.join(value_seperator)
            }
            
          }
        }


        if(content_modifier === undefined && content_modifier_value === undefined) {
          if(this.jsonData_keyword[supp_option]["no_content"]) {
            temp_dict[http_options][supp_option][content_match]["dict"][supp_option] = negate_char + new_normalized_string
            temp_dict[http_options][supp_option][content_match]["rows"].push(supp_option+ ':' + negate_char + new_normalized_string)
          
          } else {
            if( temp_dict[http_options][supp_option][content_match]["dict"]['content']){
              temp_dict[http_options][supp_option][content_match]["dict"]['content'] = temp_dict[http_options][supp_option][content_match]["dict"]['content'] 
              + ";" + negate_char + new_normalized_string
            }else {
              temp_dict[http_options][supp_option][content_match]["dict"]['content'] = negate_char + new_normalized_string
            }
            temp_dict[http_options][supp_option][content_match]["rows"].push('content:' + negate_char + new_normalized_string)
          }
          

        } else if (content_modifier !== undefined && content_modifier_value === undefined) {
            temp_dict[http_options][supp_option][content_match]["dict"]['content'] =  negate_char + new_normalized_string+ ';' + content_modifier
            temp_dict[http_options][supp_option][content_match]["rows"].push('content:'+ negate_char + new_normalized_string + ';' + content_modifier)
        } else if (content_modifier !== undefined && content_modifier_value !== undefined && typeof content_modifier_value == 'object') {
              let temp_string_list: string[] = []
              let value_seperator = ","
              if (this.jsonData_keyword[content_modifier]["value_seperator"]) {
                value_seperator = this.jsonData_keyword[content_modifier]["value_seperator"]
              }
              for(let orderName of this.jsonData_keyword[content_modifier]['order_name']) {
                if (content_modifier_value[orderName] && content_modifier_value[orderName] !== undefined && content_modifier_value[orderName] != '') {
                  temp_string_list.push(content_modifier_value[orderName])
                }
              }

              if( temp_dict[http_options][supp_option][content_match]["dict"]['content']){
                temp_dict[http_options][supp_option][content_match]["dict"]['content'] = temp_dict[http_options][supp_option][content_match]["dict"]['content'] + ";"+ content_modifier+ ":" + temp_string_list.join(value_seperator)
              }else {
                temp_dict[http_options][supp_option][content_match]["dict"]['content'] = negate_char + new_normalized_string + ';' + content_modifier+ ":" + temp_string_list.join(value_seperator)
              }

              temp_dict[http_options][supp_option][content_match]["rows"].push('content:'+ negate_char + new_normalized_string + ';' + content_modifier+ ":" + temp_string_list.join(value_seperator))
        } if (content_modifier !== undefined && content_modifier_value !== undefined && typeof content_modifier_value == 'string') {

          if( temp_dict[http_options][supp_option][content_match]["dict"]['content']){
            temp_dict[http_options][supp_option][content_match]["dict"]['content'] = temp_dict[http_options][supp_option][content_match]["dict"]['content'] + ";" + content_modifier + ':' + content_modifier_value
          }else {
            temp_dict[http_options][supp_option][content_match]["dict"]['content'] = negate_char + new_normalized_string + ';' + content_modifier + ':' + content_modifier_value
          }

          temp_dict[http_options][supp_option][content_match]["rows"].push('content:'+ negate_char + new_normalized_string + ';' + content_modifier + ':' + content_modifier_value)
        }
        //supp_option, content_match , content modifier , contet_modifier value
        if (content_modifier !== undefined && content_modifier_value !== undefined && typeof content_modifier_value == 'object') {
          let temp_string_list: string[] = []
              let value_seperator = ","
              if (this.jsonData_keyword[content_modifier]["value_seperator"]) {
                value_seperator = this.jsonData_keyword[content_modifier]["value_seperator"]
              }
              for(let orderName of this.jsonData_keyword[content_modifier]['order_name']) {
                if (content_modifier_value[orderName] && content_modifier_value[orderName] !== undefined && content_modifier_value[orderName] != '') {
                  temp_string_list.push(content_modifier_value[orderName])
                }
              }
              
              if(typeof content_match === 'object'){
                this.dataDict[http_options]['rows_to_display'].push([supp_option, new_normalized_string, content_modifier, temp_string_list.join(value_seperator), negate_match])
              } else {
                this.dataDict[http_options]['rows_to_display'].push([supp_option, content_match, content_modifier, temp_string_list.join(value_seperator), negate_match])
              }
             
        } else {

          if(typeof content_match === 'object'){
            this.dataDict[http_options]['rows_to_display'].push([supp_option, new_normalized_string, content_modifier, content_modifier_value, negate_match])
          } else {
            this.dataDict[http_options]['rows_to_display'].push([supp_option, content_match, content_modifier, content_modifier_value, negate_match])
          }

          
        }
        

        if(this.dataDict[http_options]['rows_to_display'].length >0) {
          this.dataDict[http_options]['showDataTable']=true
        } else {
          this.dataDict[http_options]['showDataTable']=false
        }

      }
    } else {
      //Lenght is zero in case to handle 0 length data
      this.dataDict[http_options]['showDataTable']=false


      //delete the form control here

    }

  }

  console.log(temp_dict)
  this.generate_rule_format(temp_dict)
}


generate_rule_format(temp_dict:any) {
  let temp_data_dict:any = {}
  temp_data_dict['rows'] = {}

  let temp_content:any =''
  for(let http_options in temp_dict) {
      for(let supp_option in temp_dict[http_options]) {
        for(let content_match in temp_dict[http_options][supp_option]) {
          if(http_options == 'meta_keyword') {
            let form_control_name = http_options
            if(this.jsonData_http3[http_options]["form_control_name"]) {
              form_control_name = this.jsonData_http3[http_options]["form_control_name"]
              if(! temp_data_dict[form_control_name]) {
                temp_data_dict[form_control_name] = []
              }
            } else {
              if(! temp_data_dict[http_options]) {
                temp_data_dict[http_options] = []
              }
            }
            
            console.log(supp_option + ":" + content_match)
            temp_data_dict[form_control_name].push(supp_option + ':' + content_match)
            
          } else {
            let form_control_name = http_options
            if(this.jsonData_http3[http_options]["form_control_name"]) {
              form_control_name = this.jsonData_http3[http_options]["form_control_name"]
              if(! temp_data_dict[form_control_name]) {
                temp_data_dict[form_control_name] = []
                temp_data_dict["rows"][form_control_name]=[]
              }
            } 

            for(let key in temp_dict[http_options][supp_option][content_match]["dict"]) {
              if(this.jsonData_keyword[supp_option]["no_content"]) {
                temp_content = key + ":" + temp_dict[http_options][supp_option][content_match]["dict"][key]
                temp_data_dict[form_control_name].push(temp_content)
              } else {
                temp_content = key + ":" + temp_dict[http_options][supp_option][content_match]["dict"][key]
                if('sticky_buffer' in this.jsonData_keyword[supp_option] && this.jsonData_keyword[supp_option]['sticky_buffer']) {
                  console.log(supp_option + ';' + temp_content)
                  temp_data_dict[form_control_name].push(supp_option + ';' + temp_content)
                } else {
                  console.log(temp_content + ';' + supp_option)
                  temp_data_dict[form_control_name].push(temp_content + ';' + supp_option)
                }
             }
            }

            for(let r of temp_dict[http_options][supp_option][content_match]["rows"]) {
              if(this.jsonData_keyword[supp_option]["no_content"]) {
                temp_data_dict["rows"][form_control_name].push(r)
              } else {
                if('sticky_buffer' in this.jsonData_keyword[supp_option] && this.jsonData_keyword[supp_option]['sticky_buffer']) {
                  console.log(supp_option + ';' + temp_content)
                  temp_data_dict["rows"][form_control_name].push(supp_option + ';' + r)
                } else {
                  console.log(temp_content + ';' + supp_option)
                  temp_data_dict["rows"][form_control_name].push(r + ';' + supp_option)
                }
              }

            }
          }
        }
      }
  }
  this.setValueInFormControl("data", temp_data_dict)
  
}

removeFromDataDict(http_options:any, index:any) {
  this.dataDict[http_options]["original_received_Data"].splice(index, 1)
  if (this.dataDict[http_options]["original_received_Data"].length ==0) {
    this.dataDict[http_options]['showDataTable']=false
  }
  this.processDataDict()
}

getHexValue(c:string) {
  let hex = c.charCodeAt(0).toString(16).toUpperCase();
  if(hex.length ==1) {
    hex = '0'+hex
  }
  return hex
}
normalizeTheContentString(content_string:string, double_quotes:boolean=true): string {
  let newstring: string = ''
  let string_length = content_string.length
  let char_list = content_string.split('')
 
  for(let i=0;i<string_length; i++){
    if(i != string_length) {
      if(char_list[i] === '\\') {
        if(char_list[i+1] === 'r' || char_list[i+1] === 'n') {
          newstring= newstring + '|'+this.getHexValue(char_list[i] + char_list[i+1])+'|'
          i = i+1
      }
    } else {
      if(this.specialCharacterPattern.test(char_list[i])) {
        newstring= newstring + '|'+this.getHexValue(char_list[i])+'|'
      } else {
        newstring= newstring + char_list[i]
      }
    }
    }
  }

  newstring = newstring.replace(/\|\|/g, ' ');
  if (double_quotes) {
    return '"' + newstring + '"'
  } 

  return newstring
 
}


generate_suricata_rule() {
  this.generateErrorMeesageDictForCommonField()
  let error_count = 0
  //console.log(this.common_part_error_message_dict)
  /* Perform the validation first */
  for(let key in this.dynamicForm.value) {
    if(key in this.jsonData_keyword) {
      if(this.jsonData_keyword[key].hasOwnProperty("is_mandatory") && this.jsonData_keyword[key]["is_mandatory"]) {
        if(this.dynamicForm.value[key] === undefined || this.dynamicForm.value[key]== "") {
          error_count +=1
          this.common_part_error_message_dict[key].showErrorMessage = true
          this.common_part_error_message_dict[key].errorMessage = "** Please specify value for " + key
        }
      }
    }
  }

  // If there is not error then proceed
  if(error_count == 0) {
    
    let temp_rule_string = ''
    let meta_keyword_string = ''
    let dictionary = this.dynamicForm.value
    let suricataRuleList = []
    let content_modifier_str = ''
    temp_rule_string+=dictionary['action'] + " " + this.protocol.toLowerCase() + " " + dictionary['source_ip'] + " " + dictionary['source_port']+ " ";
    if (dictionary['flow_direction'] == "both") {
      temp_rule_string+="<> ";
    } else {
      temp_rule_string+="-> ";
    }
    temp_rule_string+=dictionary['destination_ip'] + " " + dictionary['destination_port']
    temp_rule_string+=' ('
    temp_rule_string+='msg: "' + dictionary['msg'] + '";'

    if(dictionary['flow'] && dictionary['flow'].length>0){
      temp_rule_string+='flow:' + dictionary['flow'].join(',') + ';'
    }
    if(dictionary["content_modifier"] && dictionary["content_modifier"].length>0) {
      content_modifier_str=dictionary["content_modifier"].join(';')
      suricataRuleList.push(content_modifier_str)
    }


    if(dictionary["data"]) {
      for (let k in dictionary["data"]) {
        if (k=='meta_keyword'){
          meta_keyword_string+= dictionary["data"][k].join(';')
        } else {
          if(dictionary["data"][k].length >0) {
            for (let r of dictionary["data"][k]) {
              suricataRuleList.push(r)
            }
          }
        }
        
      }
    }

    let sid_rev_string ='sid:' +dictionary['sid'] + ";" + 'rev:' + dictionary['rev']
    if (meta_keyword_string != '') {
      sid_rev_string ='sid:' +dictionary['sid'] + ";" + 'rev:' + dictionary['rev'] + ';' + meta_keyword_string
    }
    let end_string =';)'
    
    if (suricataRuleList.length >0) {
      for (let rule of suricataRuleList) {
        this.final_suricata_rule_list.push(temp_rule_string + rule + ';' + sid_rev_string + end_string)
      }
    } else {
      this.final_suricata_rule_list.push(temp_rule_string + sid_rev_string + end_string)
    }
    console.log(this.final_suricata_rule_list)
  }


}

generateNumberedList(ruleList:any): string {
  let numberedString = '';
  ruleList.forEach((item:any, index:any) => {
    numberedString += `${index + 1}. ${item}\n`;
  });
  return numberedString;
}

async checkRules() {
  this.final_suricata_rule_check_status_list = []
  if(this.final_suricata_rule_list.length > 0) {
    for (const [index, rule] of this.final_suricata_rule_list.entries()) {
      let pattern = /rule \d/i;
      let text = ''
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


get_help_string(key: string) {
  const t_new_key = key.replace(':', '_').replace('.','_') as keyof typeof constants;
  //console.log(t_new_key)
  if(constants[t_new_key]) {
    return constants[t_new_key]
  }
  return ""
}

toggleHelp(field: string): void {
  console.log(field)
  for (let f in this.common_part_error_message_dict) { 
    if(f != field) {
      this.common_part_error_message_dict[f]["showHelpMessage"] = false
    }
  }
  if (field != 'all') {
    this.common_part_error_message_dict[field]["showHelpMessage"] = !this.common_part_error_message_dict[field]["showHelpMessage"]
  }
}

showNegationCheckBox(field: string): boolean {
    if(this.jsonData_keyword[field].hasOwnProperty("show_negate_option")) {
      if(this.jsonData_keyword[field]["show_negate_option"]) {
        return true
      } else {
        return false
      }
    } 
  return true
}

isValueRequiredInDoubleQuotes(field: string): boolean {
  if(this.jsonData_keyword[field].hasOwnProperty("value_in_double_quotes")) {
    if(this.jsonData_keyword[field]["value_in_double_quotes"]) {
      return true
    } else {
      return false
    }
  } 
return true
}

get_data_parameter(): string[] {
  let itemToRemove: string[] = ['common', 'content'];
  const keysList: string[] = Object.keys(this.jsonData_http3);
  for (let itr of itemToRemove) {
    let indexToRemove = keysList.findIndex(item => item === itr);
    if (indexToRemove !== -1) {
      keysList.splice(indexToRemove, 1);
    }

  }
  //console.log("Data param list", keysList)
 return keysList
}

}
