import {Component, OnInit} from '@angular/core';
import {NavbarService} from '../../service/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isSettingsVisible: boolean;

  constructor(public navbarService: NavbarService) {
    this.isSettingsVisible = false;
  }

  ngOnInit(): void {
  }

}
