import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  hasSettingsButton: boolean;

  constructor() {
    this.hasSettingsButton = false;
  }

  toggleSettingButtonView(): void {
    this.hasSettingsButton = !this.hasSettingsButton;
  }
}
