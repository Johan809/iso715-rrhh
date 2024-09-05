import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { StoreService } from '@services/store.service';
import { ToastComponent } from '@blocks/toast/toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, ToastComponent, NgIf],
})
export class AppComponent implements OnInit {
  constructor(public storeService: StoreService) {}

  public ngOnInit(): void {}
}
