import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface UserState {
  isNewUser: boolean;
}

export function createInitialState(): UserState {
  return {
    isNewUser: null,
  };
}

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'user' })
export class UserStore extends Store<UserState> {
  constructor() {
    super(createInitialState());
  }
}
