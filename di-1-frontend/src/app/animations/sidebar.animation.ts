import { animate, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger(
  'slideInAnimation', [
    transition(':enter', [
      style({ transform: 'translateX(100%)' }), 
      animate('200ms ease-in-out', style({ transform: 'translateX(0)' }))  
    ]),
    transition(':leave', [
      animate('200ms ease-in-out', style({ transform: 'translateX(100%)' })) 
    ]),
  ],
);
