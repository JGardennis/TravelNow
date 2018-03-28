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
  readXml(xmlLink: string, func?: (data) => any)
  {
    var xhttp = new XMLHttpRequest();
    var response;
    // var functionPassed = false;

    xhttp.onreadystatechange = function() {
      if(xhttp.readyState == 4 && xhttp.status == 200) {
        // Get response data in JSON format
        response = JSON.parse(xhttp.responseText);

        // Check for errors
        if(response.error)
          console.log('ERROR: ' + response.error);
        else if(!response)
          console.log('ERROR: No response data retrieved...');
        else {
          if(func) func(response);
          else return response;
        }
      }
    };

    xhttp.open('GET', xmlLink, true);
    xhttp.send();



    // var xhttp = new XMLHttpRequest();
    //
    // xhttp.onreadystatechange = function() {
    //   if(xhttp.readyState == 4 && xhttp.status == 200) {
    //     var responseData = JSON.parse(xhttp.responseText);
    //     if(responseData) {
    //       console.log('JSON Data received ...')
    //     }
    //     //check for errors
    //     if(responseData.error) {
    //       console.log('ERROR: ' + responseData.error);
    //     }
    //     //if no errors, execute passed function
    //     else { func(responseData); }
    //   }
    // };
    //
    // xhttp.open('GET', xmlLink, true);
    // xhttp.send();
  }

}
