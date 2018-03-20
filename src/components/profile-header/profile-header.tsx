import { Component, Prop, State, Listen } from '@stencil/core';
import { PopoverController, Popover } from '@ionic/core';

import { checkAnon } from '../../global/utils';

declare var firebase: any;

@Component({
  tag: 'profile-header',
  styleUrl: 'profile-header.scss',
  scoped: true
})
export class ProfileHeader {

  popover: Popover;

  @State() profilePic: string;

  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: PopoverController;

  componentDidLoad() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.profilePic = user.photoURL;
      }
    });

    console.log(checkAnon());
  }

  @Listen('body:closePopover')
  closePopover() {
    this.popover.dismiss();
  }

  async openPopover(event) {
    console.log(event);
    this.popover = await this.popoverCtrl.create({
      component: 'popover-page',
      ev: event
    });

    await this.popover.present();
  }

  render() {
    return (
      <ion-header md-height="96px">
        <ion-toolbar color='dark'>
          <ion-buttons slot="start">
            <slot></slot>
          </ion-buttons>
          <ion-title>IonicBeer</ion-title>

          {checkAnon() ? null : <ion-buttons slot='end'>
            <ion-button fill='clear' onClick={(ev) => this.openPopover(ev)} icon-only>
              {this.profilePic ? <img id='userImage' src={this.profilePic} alt='user profile'></img> : <div id='fake-image'></div>}
            </ion-button>
          </ion-buttons>}
        </ion-toolbar>
      </ion-header>
    );
  }
}