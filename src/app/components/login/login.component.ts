import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/service/supabase.service';
import { UserStore } from 'src/app/store/user.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private supabase: SupabaseService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.supabase.user) {
      this.router.navigate(['/']);
    }
  }

  public async githubLogin() {
    await this.supabase.signInWithGithub();
  }

}
