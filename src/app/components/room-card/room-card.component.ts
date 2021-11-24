import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit {

  @Input()
  room: Room;

  @Output()
  deleteRoom: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onDeleteClick() {
    this.deleteRoom.emit(this.room.id);
  }

}
