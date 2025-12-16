import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';

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
  
  constructor(
    public weatherData: WeatherDataService,
    public modalService: DashboardModalService) {

    effect(() => {
      this.modalData = this.modalService.modalData();      
    });
  }

  public modalData: ForecastDetails | null = null;
  
}
