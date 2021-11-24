import { Injectable } from '@angular/core';
import { RealtimeSubscription } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Room } from '../models/room.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private subscription: RealtimeSubscription;
  private _rooms: BehaviorSubject<Room[]> = new BehaviorSubject([]);
  public roomsSubject: Subject<any[]> = new Subject();

  constructor(private supabase: SupabaseService) {
  }

  get rooms(): Observable<Room[]> {
    return this._rooms.asObservable();
  }

  public async getRoomsByUser(): Promise<void> {
    const query = await this.supabase.getTable('rooms')
      .select('id, name, created_at, admin')
      .eq('admin', this.supabase.user?.id);
    this._rooms.next(query.data);
  }

  public async createNewRoom(name: string): Promise<void> {
    const room: Room = {
      admin: this.supabase.user?.id,
      name,
    };
    await this.supabase.getTable('rooms').insert(room);
  }

  public handleRoomsChanged() {
    return this.supabase.getTable(`rooms:admin=eq.${this.supabase.user.id}`)
      .on("*", payload => {
        if (payload.eventType === 'DELETE') {
          const oldItem: Room = payload.old;
          const newValue: Room[] = this._rooms.value.filter((item: Room) => oldItem.id !== item.id);
          this._rooms.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          const newItem: Room = payload.new;
          this._rooms.next([...this._rooms.value, newItem]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedItem: Room = payload.new;
          const newValue: Room[] = this._rooms.value.map((item: Room) => {
            if (updatedItem.id === item.id) {
              item = updatedItem;
            }
            return item;
          });
          this._rooms.next(newValue);
        }
      }).subscribe();
  }

  public unsubscribe() {
    this.subscription.unsubscribe();
  }
}
