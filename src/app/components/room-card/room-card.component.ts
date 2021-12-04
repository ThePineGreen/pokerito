import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit {

  public isCreate: boolean = false;

  @Input()
  room: Room;

  @Output()
  deleteRoom: EventEmitter<string> = new EventEmitter();
  @Output()
  createRoom: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if (!this.room) {
      this.isCreate = true;
    }
  }

  onDeleteClick() {
    this.deleteRoom.emit(this.room.id);
  }

  onCreateRoomClick() {
    this.createRoom.emit();
  }

}
