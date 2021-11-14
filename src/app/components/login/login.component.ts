import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/service/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private supabase: SupabaseService) { }

  ngOnInit(): void {
  }

  public githubLogin(): void {
    this.supabase.signInWithGithub();
  }

}
