import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poker',
  templateUrl: './poker.component.html',
  styleUrls: ['./poker.component.scss']
})
export class PokerComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

}
