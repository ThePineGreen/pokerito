import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomService } from 'src/app/service/room.service';
import { SupabaseService } from 'src/app/service/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  isPopupVisible = false;
  isPopupNeeded = true;
  uiid: string;
  rooms: Observable<Room[]> = this.roomService.rooms;
  formGroup: FormGroup;

  constructor(private readonly supabase: SupabaseService,
    private modalService: NgbModal,
    private roomService: RoomService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.roomService.unsubscribe();
  }

  public async ngOnInit(): Promise<void> {
    this.formGroup = new FormGroup({
      name: new FormControl(null, null),
    });

    if (sessionStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }
    this.uiid = uuidv4();

    this.roomService.getRoomsByUser();
    this.roomService.handleRoomsChanged();
  }

  public goToRoom(roomId: string) {
    this.router.navigateByUrl(`/room/${roomId}`);
  }

  public async onRoomCreate(): Promise<void> {
    if (this.formGroup.valid) {
      await this.roomService.createNewRoom(this.formGroup.get('name').value).then(value => {
        this.modalService.dismissAll();
      });
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  public onDeleteRoom(roomId: string): void {
    this.roomService.deleteRoom(roomId);
  }
}
