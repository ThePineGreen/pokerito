import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/gotrue-js';
import { SupabaseService } from 'src/app/service/supabase.service';
import { NavbarService } from '../../service/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isSettingsVisible: boolean;

  @Input()
  session: Session;

  constructor(public navbarService: NavbarService, public router: Router, private supabase: SupabaseService) {
    this.isSettingsVisible = false;
  }

  ngOnInit(): void {
  }

  public async logout() {
    await this.supabase.signOut()
      .then(value => {
        if (value.error) {
          console.error(value.error);
        } else {
          this.router.navigateByUrl('/auth');
        }
      });
  }

}
