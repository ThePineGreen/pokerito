import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SocketService} from '../../service/socket.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  isVisible = false;
  formGroup: FormGroup;
  user: User;

  @Input() visible = false;
  @Input() roomId: string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.user = {
      username: sessionStorage.getItem('name'),
      userId: sessionStorage.getItem('userId'),
      roomId: this.roomId,
      connected: true,
      owner: true,
    };
    this.formGroup = new FormGroup({
      nameInput: new FormControl(null, null),
    });

    this.formGroup.get('nameInput').setValue(this.user.username);
  }

  onChangeVisibility(value: boolean): void {
    this.isVisible = value;
    this.visibleChange.emit(value);
  }

  onChangeNameClick(): void {
    this.onChangeVisibility(false);
    this.socketService.getSocket().emit('update-user', {
      ...this.user,
      username: this.formGroup.get('nameInput').value,
    });
  }

}
