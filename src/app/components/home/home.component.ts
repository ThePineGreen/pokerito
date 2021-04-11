import {Component, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPopupVisible = false;
  isPopupNeeded = true;
  uiid: string;

  ngOnInit(): void {
    if (sessionStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }
    this.uiid = uuidv4();
  }
}