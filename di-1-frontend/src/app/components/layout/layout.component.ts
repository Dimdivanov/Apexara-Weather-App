import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from '././footer/footer.component';
import { SidebarComponent } from '././sidebar/sidebar.component';
import { NavigationComponent } from '././navigation/navigation.component';
import { AuthenticatingComponent } from './../authenticating/authenticating.component';

import { ThemeService } from './../../services/theme.service';
import { NavigationService } from './../../services/navigation.service';
import { GeolocateService } from './../../services/geolocate.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    SidebarComponent,
    NavigationComponent,
    AuthenticatingComponent,
  ],
})

export class LayoutComponent {

  constructor(
    public themeService: ThemeService,
    public geoLocateService: GeolocateService,
    public navigationService: NavigationService) { }
  
}
