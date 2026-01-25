import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {
 
  constructor() {

    this.applyTheme(this.theme());
  }

  private readonly theme = signal<string>('dark');
  
  public themeSignal = computed(() => this.theme);

  public setTheme(theme: string): void {
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  public updateTheme(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme); 
  }

  private applyTheme(theme: string): void {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
  } 
  
}
