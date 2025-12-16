import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TemperatureUnitService {

  private readonly storageKey = 'preferredTemperatureUnit';

  private isCelsiusSignal = signal(this.loadInitialUnit());
  readonly isCelsius = this.isCelsiusSignal.asReadonly();

  public toggleUnit() {
    const newVal = !this.isCelsiusSignal();

    this.isCelsiusSignal.set(newVal);

    localStorage.setItem(this.storageKey, newVal ? 'C' : 'F');
  }

  public convertToF(celsius: number): number {
    return Math.round((celsius * 9) / 5 + 32);
  }

  private loadInitialUnit(): boolean {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === 'F') return false;
    return true; 
  }
  
}
