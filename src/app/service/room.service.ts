import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablesEnum } from '../common/tables.enum';
import { Room } from '../models/room.model';
import { RoomsStore } from '../store/rooms.store';
import { RoomsQuery } from '../store/rooms.query';
import { SupabaseService } from './supabase.service';
@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private supabase: SupabaseService,
    private roomsStore: RoomsStore,
    private roomsQuery: RoomsQuery,) {
  }

  get rooms(): Observable<Room[]> {
    return this.roomsQuery.rooms$;
  }

  public async getRoomsByUser(): Promise<void> {
    const query = await this.supabase.getTable(TablesEnum.ROOMS)
      .select('id, name, created_at, admin')
      .eq('admin', this.supabase.user?.id);
    this.roomsStore.add(query.data);
  }

  public async createNewRoom(name: string): Promise<void> {
    const room: Room = {
      admin: this.supabase.user?.id,
      name,
    };
    await this.supabase.getTable(TablesEnum.ROOMS).insert(room);
  }

  public async deleteRoom(id: string): Promise<void> {
    await this.supabase.getTable(TablesEnum.ROOMS).delete().match({ id })
  }

  public handleRoomsChanged() {
    return this.supabase.getTable(`rooms:admin=eq.${this.supabase.user.id}`)
      .on("*", payload => {
        if (payload.eventType === 'DELETE') {
          const oldItem: Room = payload.old;
          this.roomsStore.remove(oldItem.id);
        } else if (payload.eventType === 'INSERT') {
          const newItem: Room = payload.new;
          this.roomsStore.add(newItem);
        } else if (payload.eventType === 'UPDATE') {
          const updatedItem: Room = payload.new;
          this.roomsStore.update(updatedItem.id, updatedItem);
        }
      }).subscribe();
  }
}
