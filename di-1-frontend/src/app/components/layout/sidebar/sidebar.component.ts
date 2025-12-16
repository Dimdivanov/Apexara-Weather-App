import { Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { HighlightSidebarMenuDirective } from './../../../directives/highlight-sidebar-menu.directive';

import { slideInAnimation } from './../../../animations/sidebar.animation';

import { IpiButtonComponent } from '@ipi-soft/ng-components/button';

import { UserService } from './../../../services/user.service';
import { ThemeService } from './../../../services/theme.service';
import { NavigationService } from './../../../services/navigation.service';
import { TemperatureUnitService } from './../../../services/temperature-unit.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [slideInAnimation],
  imports: [
    RouterLink, 
    CommonModule, 
    IpiButtonComponent,
    MatSlideToggleModule,
    HighlightSidebarMenuDirective, 
  ],
})

export class SidebarComponent {

  constructor(
    public userService: UserService,
    public navigationService: NavigationService,
    public temperatureToggleService: TemperatureUnitService,
    private themeService: ThemeService) { }
  
  public toggleTheme(): void {
    this.themeService.updateTheme();    
  }
  
  public logout(): void {
    this.userService.logout();
  }
   
}
