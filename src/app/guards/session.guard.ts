import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SupabaseService } from "../service/supabase.service";

@Injectable()
export class SessionGuard implements CanActivate {

  constructor(private supabase: SupabaseService,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => setTimeout(() => {
      const isSignedIn = !!this.supabase.session?.user

      if (!isSignedIn) {
        this.router.navigate(['/auth'])
        resolve(false);
      }

      resolve(true);
    }, 500));
  }
}
