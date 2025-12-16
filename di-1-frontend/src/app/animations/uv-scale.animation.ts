import { animate, state, style, transition, trigger } from '@angular/animations';

export const rotateUv = trigger(
  'rotateUv', [
    state('*', style({ transform: 'rotate({{angle}}deg)' }), { params: { angle: 0 } }),
      transition('* => *', animate('500ms ease-in-out'))
  ],
);
