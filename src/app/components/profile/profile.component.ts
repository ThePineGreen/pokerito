import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NewUser } from 'src/app/models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public formGroup: FormGroup;
  public user: NewUser;
  public hasAlert: boolean = false;

  @ViewChild('alert', { static: false }) alert: NgbAlert;

  constructor(private userService: UserService) { }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl(null, null),
    });

    await this.userService.getUser().then((result) => {
      this.user = result.data[0];
    });
  }

  public async updateUser() {
    if (this.formGroup.valid) {
      await this.userService.updateUserName(this.formGroup.get('name').value)
        .then(() => {
          this.hasAlert = true;
          setTimeout(() => {
            this.hasAlert = false;
          }, 5000);
        });
    }
  }

}
