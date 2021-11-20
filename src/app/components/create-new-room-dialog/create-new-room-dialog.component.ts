import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SupabaseService } from 'src/app/service/supabase.service';

@Component({
  selector: 'app-create-new-room-dialog',
  templateUrl: './create-new-room-dialog.component.html',
  styleUrls: ['./create-new-room-dialog.component.scss']
})
export class CreateNewRoomDialogComponent implements OnInit {

  constructor(private supabase: SupabaseService, private formBuilder: FormBuilder) { }

  formGroup: FormGroup;

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [null]
    });
  }

  onCreateClick(): void {
    this.supabase.createNewRoom(this.formGroup.get('name').value || 'New Room').then(() => {
      alert('redirect to room');
    });
  }

}
