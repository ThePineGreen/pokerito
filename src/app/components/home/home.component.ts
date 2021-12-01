import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Room } from 'src/app/models/room.model';
import { RoomService } from 'src/app/service/room.service';
import { UserService } from 'src/app/service/user.service';
import { RoomsQuery } from 'src/app/store/rooms.query';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPopupVisible = false;
  isPopupNeeded = true;
  rooms$: Observable<Room[]> = this.roomsQuery.rooms$;
  formGroup: FormGroup;

  constructor(private modalService: NgbModal,
    private userService: UserService,
    private roomsQuery: RoomsQuery,
    private roomService: RoomService,
    private router: Router) { }

  public async ngOnInit(): Promise<void> {

    await this.userService.isNewUser().then(async (value: boolean) => {
      if (value) {
        await this.userService.setUserData();
      }
    });

    this.formGroup = new FormGroup({
      name: new FormControl(null, null),
    });

    if (sessionStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }

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
