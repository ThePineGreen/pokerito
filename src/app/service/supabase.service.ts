import { Injectable } from "@angular/core";
import { AuthChangeEvent, createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get session(): Session {
    return this.supabase.auth.session();
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  public async signInWithGithub() {
    const { user, session, error } = await this.supabase.auth.signIn({
      provider: 'github',
    });
  }

  public async signOut() {
    return this.supabase.auth.signOut();
  }
}
