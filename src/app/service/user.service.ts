import { Injectable } from "@angular/core";
import { take, tap } from "rxjs/operators";
import { TablesEnum } from "../common/tables.enum";
import { NewUser } from "../models/user.model";
import { UserQuery } from "../store/user.query";
import { UserStore } from "../store/user.store";
import { SupabaseService } from "./supabase.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private supabase: SupabaseService,
    private userQuery: UserQuery,
    private userStore: UserStore) { }

  public async isNewUser(): Promise<boolean> {
    this.userQuery.selectIsNewUser$.pipe(
      take(1),
      tap((value) => {
        if (value !== null) {
          return value;
        }
      }),
    );

    const hasUser = !!await (
      await this.supabase.getTable(TablesEnum.USERS)
        .select('id')
        .eq('id', this.supabase.user.id)
    ).data.length;
    this.userStore.update(state => {
      !hasUser
    });

    return !hasUser;
  }

  public async setUserData() {
    const user: NewUser = {
      id: this.supabase.user.id,
      name: this.supabase.user.user_metadata.name,
      avatar: this.supabase.user.user_metadata.avatar_url,
    };
    await this.supabase.getTable(TablesEnum.USERS).insert(user);
  }

  public async getUser(): Promise<any> {
    return await this.supabase.getTable(TablesEnum.USERS).select().eq('id', this.supabase.user.id);
  }

  public async updateUserName(name: string) {
    await this.supabase.getTable(TablesEnum.USERS).update({ name }).eq('id', this.supabase.user.id);
  }
}
