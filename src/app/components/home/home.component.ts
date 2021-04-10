import {Component, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPopupVisible = false;
  isPopupNeeded = true;
  uiid: string;

  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }
    this.uiid = uuidv4();
  }

  onStartGameWithNameClick(name: HTMLInputElement): void {
    const uiid: string = uuidv4();
    localStorage.setItem('name', name.value);
    navigator.clipboard.writeText(window.location.href + '/poker/' + uiid)
      .then(() => this.router.navigate(['/poker', {id: uiid}], {relativeTo: this.route}));
  }

  onStartGameClick(): void {
    const uiid: string = uuidv4();
    localStorage.getItem('name');
    navigator.clipboard.writeText(window.location.href + '/poker/' + uiid)
      .then(() => this.router.navigate(['/poker', {id: uiid}], {relativeTo: this.route}));
  }

}
