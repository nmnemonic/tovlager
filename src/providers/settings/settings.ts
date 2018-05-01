import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';


@Injectable()
export class SettingsProvider {
  userName: string;
  serverAddress: string;

  constructor(public http: HttpClient,
    private nativeStorage: NativeStorage) {
    console.log('Hello SettingsProvider Provider');
    this.loadValues();
  }

  loadValues() {
    this.nativeStorage.getItem('myitem')
      .then(
        data => {
          console.log(JSON.stringify(data));
          this.userName = data.userName;
          this.serverAddress = data.serverAddress;
        },
        error => {
          this.userName = "unknown";
          this.serverAddress = "192.168.1.176";
        }
      );
  }

  save() {
    console.log("Saving...");
    this.nativeStorage.setItem('myitem', { userName: this.userName, serverAddress: this.serverAddress })
      .then(
        () => {
          console.log('Stored item!');
        },
        error => {
          console.error('Error storing item', error);
        }
      );
  }

  setUserName(name) {
    this.userName = name;
  }

  setUrl(serverAddress) {
    this.serverAddress = serverAddress;
  }

  getUserName() {
    return this.userName;
  }

  getUrl() {
    return this.serverAddress;;
  }
}
