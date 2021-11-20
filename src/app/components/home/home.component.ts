import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/service/supabase.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewRoomDialogComponent } from '../create-new-room-dialog/create-new-room-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isPopupVisible = false;
  isPopupNeeded = true;
  uiid: string;
  rooms: any = null;

  constructor(private readonly supabase: SupabaseService,
    public dialog: MatDialog,
    private router: Router) { }

  public async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }
    this.uiid = uuidv4();

    this.rooms = (await this.supabase.getUserRooms()).data;
  }

  public goToRoom(roomId: string) {
    this.router.navigateByUrl(`/room/${roomId}`);
  }

  public async onRoomCreate(): Promise<void> {
    // await this.supabase.createNewRoom();
    this.dialog.open(CreateNewRoomDialogComponent);
  }
}
