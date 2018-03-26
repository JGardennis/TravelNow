import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TransportApiProvider {

  constructor() {}

  /************************
  @name:      readXml
  @desc:      uses xml Http link to request data from transport api
  @param xmlLink:   the url to use for xml data request
  @param func:      a custom function to execute against received data
  ************************/
  readXml(xmlLink: string, func: (data) => any)
  {
    var xhttp = new XMLHttpRequest();
    
  }

}
