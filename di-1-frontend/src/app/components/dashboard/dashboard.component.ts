import { Component } from '@angular/core';

import { ForecastComponent } from '././forecast/forecast.component';
import { WeeklyModalComponent } from '././weekly-modal/weekly-modal.component';

import { DashboardModalService } from './../../services/dashboard-modal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    ForecastComponent,
    WeeklyModalComponent,
  ],
})

export class DashboardComponent {

  constructor(
    public modalService: DashboardModalService) { }
    
}
