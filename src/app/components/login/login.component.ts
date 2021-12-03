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

  loading: boolean;

  ngOnInit(): void {
    if (this.supabase.user) {
      this.router.navigate(['/']);
    }
  }

  public async githubLogin() {
    await this.supabase.signInWithGithub();
  }

  public async handleLogin(input: string) {
    try {
      this.loading = true;
      await this.supabase.signIn(input);
      alert('Check your email for the login link!');
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      this.loading = false;
    }
  }

}
