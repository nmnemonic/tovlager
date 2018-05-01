import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class RestProvider {
  apiUrl = 'https://tovserver.herokuapp.com';

  constructor(private http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getProducts() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/products').subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  collectItem(data) {
    console.log("Sending item to server " + JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/collect/' + data.barcode, JSON.stringify(data), httpOptions)
        .subscribe((res) => {
          console.log("ok:" + JSON.stringify(res));
          resolve(res);
        }, (err) => {
          console.log("err:" + JSON.stringify(err));
          reject(err);
        });
    });
  }

  getProduct(barcode) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + '/products/' + barcode).subscribe(data => {
        console.log(JSON.stringify(data));
        resolve(data[0]);
      }, err => {
        console.log("getProduct failed");
        reject(err);
      });
    });
  }


}
