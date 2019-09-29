import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit {
  // Data passed in by componentProps
  @Input() address: string;
  @Input() bank_name: string;
  @Input() branch: string;
  @Input() ifsc: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
}
