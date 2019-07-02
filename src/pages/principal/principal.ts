import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceMotion, DeviceMotionAccelerationData } from "@ionic-native/device-motion";
import { SmartAudioProvider } from "../../providers/smart-audio/smart-audio";
import { Flashlight } from "@ionic-native/flashlight";
import { Vibration } from "@ionic-native/vibration";

/**
 * Generated class for the PrincipalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

  status: boolean;
  subscriptionMotion: any;
  data: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public deviceMotion: DeviceMotion,
    public smartAudio: SmartAudioProvider,
    public flash: Flashlight,
    public vibration: Vibration) {
    this.status = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

  toggleAlarma() {
    let intento: number = 0;
    this.status = !this.status;
    let flagVertical: boolean = true;
    let flagDerecha: boolean = true;
    let flagIzquierda: boolean = true;
    let flagHorizontal: boolean = true;

    if (this.status) {
      this.subscriptionMotion = this.deviceMotion.watchAcceleration({ frequency: 200 })
        .subscribe((acceleration: DeviceMotionAccelerationData) => {
          intento = intento + 1;

          if (!this.data) {
            this.data = acceleration;
            return;
          }

          if (this.data.x != acceleration.x || this.data.y != acceleration.y || this.data.z != acceleration.z) {

            this.data = acceleration;

            if (this.data.x < -3.0 && flagDerecha) {
              flagDerecha = false;
              this.smartAudio.play("derecha");
            } else if (this.data.x > -3.0 && !flagDerecha) {
              flagDerecha = true;
            }

            if (this.data.x > 3.0 && flagIzquierda) {
              flagIzquierda = false;
              this.smartAudio.play("izquierda");
            } else if (this.data.x < 3.0 && !flagIzquierda) {
              flagIzquierda = true;
            }

            if (this.data.y > 3.0 && flagVertical) {
              flagVertical = false;
              this.smartAudio.play("luz");
              this.flash.switchOn();
              setTimeout(() => {
                this.flash.switchOff();
              }, 5000);
            } else if (this.data.y < 3.0 && !flagVertical) {
              flagVertical = true;
            }

            if (this.data.y < 1.0 && this.data.x < 1.0 && intento > 1 && flagHorizontal) {
              flagHorizontal = false;
              this.smartAudio.play("luz");
              this.vibration.vibrate(5000);
            } else if ((this.data.y > 1.0 || this.data.x > 1.0) && !flagHorizontal){
              flagHorizontal = true;
            }
          }

        },
          (err) => console.log(err));
    } else {
      this.subscriptionMotion.unsubscribe();
    }
  }

}
