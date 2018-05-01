import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { RestProvider } from '../../providers/rest/rest';
import { SettingsPage } from '../settings/settings';

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
  selectedProduct: any;
  productFound: boolean = false;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    public restProvider: RestProvider) {
      }

  scan() {
    this.selectedProduct = {};
    this.barcodeScanner.scan(scanOptions).then(barcodeData => {
      console.log("got barcode");
      this.processBarcode(barcodeData);
    }, (err) => {
      this.showToast(err);
    });
  }

  pick() {
    var item = { barcode: this.selectedProduct.barcode, user: "Nils-Morten", info: "Not implemented yet" };
    this.restProvider.collectItem(item).then((result) => {
      console.log(result);
      this.showToast("Registert som plukket");
      this.selectedProduct = {};
      this.productFound = false;
    }, (err) => {
      this.showToast("Registeringen feilet.  Scann en ny strekkode, eller prøv igjen");
      console.log(err);
    });
  }

  processBarcode(barcodeData) {
    console.log(barcodeData.text);
    this.restProvider.getProduct(barcodeData.text).then(data => {
      if (data != undefined) {
        console.log("got product:"+ JSON.stringify(data));
        this.selectedProduct = data;
        this.productFound = true;
        this.showToast('Fant produkt: ' + this.selectedProduct.vendoritemnumber);
        console.log(this.selectedProduct.barcode);
      } else {
        this.selectedProduct = {};
        this.productFound = false;
        this.showToast('Fant ikke noe produkt med denne strekkoden');
      }
    }, (err) => {
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
