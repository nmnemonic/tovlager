import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  userName: string;
  serverAddress: string;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private settings: SettingsProvider) {
    this.userName=this.settings.getUserName();
    this.serverAddress = this.settings.getUrl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  save() {
    this.settings.setUrl(this.serverAddress);
    this.settings.setUserName(this.userName);
    this.settings.save();
    this.navCtrl.pop();
  }

  getUserName(){
    return this.userName;
  }

   getUrl(){
      return this.serverAddress;;
    }
}
