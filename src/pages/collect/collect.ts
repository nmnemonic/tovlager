import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { RestProvider } from '../../providers/rest/rest';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {
  selectedProduct: any;
  userName: string;
  info: string ="";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast: Toast,
    public settingsProvider: SettingsProvider,
    public restProvider: RestProvider) {
    console.log("CollectPage");
    console.log(JSON.stringify(navParams.get('data')));
    this.selectedProduct = navParams.get('data');
    this.userName = settingsProvider.getUserName();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectPage');
  }

  pick() {
    var item = { barcode: this.selectedProduct.barcode, user: this.userName, info: this.info };
    this.restProvider.collectItem(item).then((result) => {
      console.log(result);
      this.showToast("Registert som plukket");
      this.navCtrl.pop();
    }, (err) => {
      this.showToast("Registeringen feilet.  Scann en ny strekkode, eller prøv igjen");
      console.log(err);
    });
  }

  showToast(text) {
    console.log("showing toast:" + text);
    this.toast.show(text, '5000', 'center').subscribe(
      toast => {
        console.log("showed toast:" + text);
      });
  }

}
