import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { RestProvider } from '../../providers/rest/rest';
import { SettingsProvider } from '../../providers/settings/settings';
import { SettingsPage } from '../settings/settings';
import { CollectPage } from '../collect/collect';

const scanOptions = {
  preferFrontCamera: false, // iOS and Android
  showFlipCameraButton: true, // iOS and Android
  showTorchButton: true, // iOS and Android
  torchOn: false, // Android, launch with the torch switched on (if available)
  prompt: "Plasser strekkoden i skannevinduet", // Android
  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
  //formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
  //orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
  disableAnimations: true, // iOS
  disableSuccessBeep: false // iOS and Android
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  settingsPage = SettingsPage;
  collectPage = CollectPage;
  userName: string;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    public settingsProvider: SettingsProvider,
    public restProvider: RestProvider) {
  }

  public ionViewWillEnter() {
    console.log("ionViewWillEnter fired");
    this.userName = this.settingsProvider.getUserName();
  }

  scan() {
    this.barcodeScanner.scan(scanOptions).then(barcodeData => {
      console.log("got barcode");
      this.processBarcode(barcodeData);
    }, (err) => {
      this.showToast(err);
    });
  }

  processBarcode(barcodeData) {
    console.log(barcodeData.text);
    this.restProvider.getProduct(barcodeData.text).then(data => {
      if (data != undefined) {
        console.log("got product:" + JSON.stringify(data));
        this.goToCollectPage(data);
      } else {
        this.showToast('Fant ikke noe produkt med denne strekkoden');
      }
    }, (err) => {
      console.log(err);
      this.showToast("Feil:  Sjekk at du har nettverk");
    }).catch(function() {
      console.log("Promise Rejected (processBarcode)");
      this.showToast("Feil:  Manglende forbindelse til server??");
    });
  }

  showToast(text) {
    console.log("showing toast:" + text);
    this.toast.show(text, '5000', 'center').subscribe(
      toast => {
        console.log("showed toast:" + text);
      });
  }

  goToCollectPage(product) {
    product = product || {
      barcode: '12345',
      benevning: '0000',
      vendor: 'ACME',
      vendoritemnumber: 'No such product!'
    };

    this.navCtrl.push(this.collectPage, {
      data: product
    });
  }

}
