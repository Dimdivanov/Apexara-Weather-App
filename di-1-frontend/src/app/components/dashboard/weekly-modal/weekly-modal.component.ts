import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';

import { NumToFixedPipe } from './../../../pipes/num-to-fixed.pipe';
import { TimeTransformPipe } from './../../../pipes/time-transform.pipe';

import { WeatherDataService } from './../../../services/weather-data.service';
import { DashboardModalService } from './../../../services/dashboard-modal.service';

import { ForecastDetails } from './../../../models/forecast.model';

@Component({
  selector: 'app-weekly-modal',
  templateUrl: './weekly-modal.component.html',
  styleUrls: ['./weekly-modal.component.css'],
  imports: [
    CommonModule,
    NumToFixedPipe,
    TimeTransformPipe,
  ],
})

export class WeeklyModalComponent {
  public weatherData = inject(WeatherDataService);
  public modalService = inject(DashboardModalService);
  public modalData: ForecastDetails | null = null;
  
  constructor() {
    effect(() => {
      this.modalData = this.modalService.modalData();      
    });
  }
  
}
