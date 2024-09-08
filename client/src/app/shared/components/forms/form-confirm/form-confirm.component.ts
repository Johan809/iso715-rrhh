// Angular modules
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// External modules
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-confirm',
  templateUrl: './form-confirm.component.html',
  styleUrls: ['./form-confirm.component.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule],
})
export class FormConfirmComponent implements OnInit {
  @Input() data: any;

  constructor(protected activeModal: NgbActiveModal) {}

  public ngOnInit(): void {}

  public async onClickSubmit(): Promise<void> {
    this.activeModal.close(true);
  }

  public onClickClose(): void {
    this.activeModal.close(false);
  }
}
