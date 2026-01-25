import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GeolocateService {

  private coordsSignal = signal<{ lat: number, lon: number } | null>(null);
  readonly coords = this.coordsSignal.asReadonly();

  public geoLocate(): any {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.coordsSignal.set({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      err => {
        console.error('Geolocation error: ', err);
        this.coordsSignal.set(null);
      }
    )
  }

}
