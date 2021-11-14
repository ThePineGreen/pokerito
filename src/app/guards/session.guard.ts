import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { SupabaseService } from "../service/supabase.service";

@Injectable()
export class SessionGuard implements CanActivate {

  constructor(private supabase: SupabaseService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (!this.supabase.session) {
      return this.router.parseUrl('/auth');
    }
    return true;
  }
}
