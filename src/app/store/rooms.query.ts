import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { RoomsState, RoomsStore } from "./rooms.store";


@Injectable({ providedIn: 'root' })
export class RoomsQuery extends QueryEntity<RoomsState> {
  rooms$ = this.selectAll();

  constructor(protected store: RoomsStore) {
    super(store);
  }
}
