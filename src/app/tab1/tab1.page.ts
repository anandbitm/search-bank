import { Component, ViewChild, NgZone } from "@angular/core";
import { IonInfiniteScroll } from "@ionic/angular";

import { ModalController } from "@ionic/angular";
import { ModalComponent } from "./modal/modal.component";
import { BankService } from "../bank.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll, null) infiniteScroll: IonInfiniteScroll;
  banks: any = []; // view data
  banksMaster: any = []; // master data to display
  masterData: any = []; // it wont't change
  selectedCity: string = "MUMBAI";
  showLoader = true;
  counter: number = 0;
  constructor(
    private bankService: BankService,
    private modalController: ModalController,
    private zone: NgZone
  ) {
    this.changeCity();
  }

  // load fresh data from API if city is changed
  changeCity() {
    this.showLoader = true;
    this.bankService.getBanksDetail(this.selectedCity).subscribe(banks => {
      this.showLoader = false;
      this.banksMaster = banks;
      this.masterData = banks;
      this.counter = 9;
      this.banks = this.banksMaster.slice(0, this.counter);
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log("Done");
      event.target.complete();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      console.log("len:", this.banks.length);
      this.counter = this.counter + 10;
      this.banks = this.banksMaster.slice(0, this.counter);
      if (this.banks.length == this.banksMaster.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  // Show bank details in Modal
  async presentModal(data) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        ifsc: data.ifsc,
        address: data.address,
        bank_name: data.bank_name,
        branch: data.branch
      }
    });
    return await modal.present();
  }

  shwoMore(data) {
    let modal = this.presentModal(data);
  }

  // Node: We can have Infinite Scroll since data is more
  searchBank(event) {
    this.zone.run(() => {
      this.showLoader = true;
      this.banks = [];
      const query = event.target.value.toLowerCase();
      let sArr = [];
      let banks = JSON.parse(JSON.stringify(this.masterData));
      if (query) {
        var keys = [
          "ifsc",
          "branch",
          "address",
          "city",
          "district",
          "state",
          "bank_name"
        ];
        sArr = banks.filter(obj => {
          for (let i = 0; i < keys.length; i++) {
            if (obj[keys[i]].toLowerCase().indexOf(query) !== -1) {
              return true;
            }
          }
          return false;
        });
        this.banksMaster = sArr;
        this.counter = 9;
        this.banks = this.banksMaster.slice(0, this.counter);
        this.showLoader = false;
      } else {
        this.banksMaster = this.masterData.slice(0);
        this.counter = 9;
        this.banks = this.masterData.slice(0, this.counter);
        this.showLoader = false;
      }
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
