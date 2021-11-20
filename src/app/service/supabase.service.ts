import { Injectable } from "@angular/core";
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from "@supabase/supabase-js";
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

  get user(): User | null {
    return this.supabase.auth.user();
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  public async signInWithGithub(): Promise<void> {
    const { user, session, error } = await this.supabase.auth.signIn({
      provider: 'github',
    });
  }

  public async signOut(): Promise<{error}> {
    return this.supabase.auth.signOut();
  }

  public async createNewRoom(name: string): Promise<void> {
    await this.supabase.from('rooms').insert({
      admin: this.user.id,
      name,
    });
  }

  getUserRooms(): any {
    return this.supabase.from('rooms').select('id, created_at, admin, name').eq('admin', this.supabase.auth.user()?.id);
  }
}
