import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/service/supabase.service';
import { v4 as uuidv4 } from 'uuid';

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

  constructor(private readonly supabase: SupabaseService) { }

  public async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('name')) {
      this.isPopupNeeded = false;
    }
    this.uiid = uuidv4();

    this.rooms = (await this.supabase.getUserRooms()).data;
    console.dir(this.rooms);
  }

  public async onRoomCreate(): Promise<void> {
    await this.supabase.createNewRoom();
  }
}
