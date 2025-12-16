import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './../loader/loader.component';

import { WeatherDataService } from './../../services/weather-data.service';

@Component({
    selector: 'app-authenticating',
    templateUrl: './authenticating.component.html',
    styleUrls: ['./authenticating.component.css'],
    imports: [
      CommonModule,
      LoaderComponent,
    ],
})

export class AuthenticatingComponent {
    
  constructor(
    public weatherService: WeatherDataService) { }
  
  public get showLoader(): boolean {
    return this.weatherService.isAuthenticating();
  };
    
}
