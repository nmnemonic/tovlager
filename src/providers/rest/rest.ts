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
  apiUrl = 'http://192.168.1.241:8080';

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
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getProduct(barcode) {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/product/' + barcode).subscribe(data => {
        console.log(data);
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


}
