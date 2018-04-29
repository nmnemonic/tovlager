import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { RestProvider } from '../../providers/rest/rest';

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

  products: any[] = [];
  restproducts: any;
  selectedProduct: any;
  productFound: boolean = false;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toast: Toast,
    public dataService: DataServiceProvider,
    public restProvider: RestProvider) {
    //    this.getLocalProducts();
    this.getProducts();
  }

  getLocalProducts() {
    this.dataService.getProducts()
      .subscribe((response) => {
        this.products = response;
        console.log("local");
        console.log(this.products);
      });
  }

  getProducts() {
    this.restProvider.getProducts()
      .then(data => {
        this.restproducts = data;
        console.log("rest");
        console.log(this.restproducts);
      });
  }

  collectItem(user, barcode, info) {

  }

  scan() {
    this.selectedProduct = {};
    this.barcodeScanner.scan(scanOptions).then((barcodeData) => {
      console.log(barcodeData.text);
      this.selectedProduct = this.restproducts.find(product => product.barcode === barcodeData.text);
      if (this.selectedProduct !== undefined) {
        this.productFound = true;
        console.log(this.selectedProduct.barcode);
      } else {
        this.selectedProduct = {};
        this.productFound = false;
        this.toast.show('Product not found', '5000', 'center').subscribe(
          toast => {
            console.log('Product not found');
          }
        );
      }
    }, (err) => {
      this.toast.show(err, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  pick() {
    var item = { barcode: this.selectedProduct.barcode, user: "Nils-Morten", info: "Not implemented yet" };
    this.restProvider.collectItem(item).then((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }

  processBarcode(barcodeData) {
    console.log(barcodeData.text);
    this.selectedProduct = this.restproducts.find(product => product.barcode === barcodeData.text);
    if (this.selectedProduct !== undefined) {
      this.productFound = true;
      console.log(this.selectedProduct.barcode);
    } else {
      this.selectedProduct = {};
      this.productFound = false;
      this.toast.show('Product not found', '5000', 'center').subscribe(
        toast => {
          console.log('Product not found');
        });
    }
  }

}
