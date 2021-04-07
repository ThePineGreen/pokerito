import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPopupVisible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onStartGameClick() {
    const uiid: string = uuidv4();
    navigator.clipboard.writeText(window.location.href + '/poker/' + uiid).then(() => window.location.assign(`/poker/${uiid}`));
  }

}
