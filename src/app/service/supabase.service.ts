import { Injectable } from "@angular/core";
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from "@supabase/supabase-js";
import { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/main/lib/SupabaseQueryBuilder";
import { SupabaseRealtimeClient } from "@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { TablesEnum } from "../common/tables.enum";
import { LoginData } from "../models/supabase.model";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.loadUser();

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this._currentUser.next(session.user);
      } else {
        this._currentUser.next(false);
      }
    });
  }

  get session(): Session | null {
    return this.supabase.auth.session();
  }

  get user(): User | null {
    return this.supabase.auth.user();
  }

  private async loadUser() {
    const user = await this.supabase.auth.user();

    if (user) {
      this._currentUser.next(user);
    } else {
      this._currentUser.next(false);
    }
  }

  public getTable(tableName: TablesEnum | string): SupabaseQueryBuilder<any> {
    return this.supabase.from(tableName);
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  public signInWithGithub(): Promise<LoginData> {
    return this.supabase.auth.signIn({
      provider: 'github',
    });
  }

  public signIn(email: string) {
    return this.supabase.auth.signIn({email});
  }

  public async signOut(): Promise<{ error }> {
    return this.supabase.auth.signOut();
  }

  public subscribeTo(tableName: string): SupabaseRealtimeClient {
    return this.supabase.from(tableName)
      .on('*', payload => {
        console.log('changes', payload);
      })
  }
}
