import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DashboardModalService {

  public isModalOpen = signal<boolean>(false);
  public modalData = signal<any>(null);

  public closeModal(): void {
    this.isModalOpen.set(false);

    this.modalData.set(null);
  }

  public openModal(data: any): void {
    this.isModalOpen.set(true);
    
    this.modalData.set(data);
  }
  
}
