import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Room } from "../models/room.model";

export interface RoomsState extends EntityState<Room, string> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'rooms' })
export class RoomsStore extends EntityStore<RoomsState> {
  constructor() {
    super();
  }
}
