import { Component } from '@angular/core';
import { Session } from '@supabase/gotrue-js';
import { SupabaseService } from './service/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public session: Session = this.supabase.session;

  constructor(private supabase: SupabaseService) {
  }

  ngOnInit() {
    this.supabase.authChanges((_, session) => this.session = session);
  }
}

