import {animate, animation, style} from '@angular/animations';

export const slideInAnimation = animation([
    style({ opacity: 0, 'max-height': '50px', transform: 'translateY(50px)' }),
    animate('.2s ease-in', style({ })),
    animate('.3s ease-in', style({ opacity: 1, 'max-height': '100%', transform: 'translateY(0px)' })),
]);

export const slideOutAnimation = animation([
    animate('.3s ease-in', style({ opacity: 0, height: 0, transform: 'translateY(50px)' })),
]);

export const slideInCards = animation([
  style({ display: 'none', 'max-height': '50px', transform: 'translateY(50px)' }),
  animate('.3s ease-in', style({display: 'block', 'max-height': '100%', transform: 'translateY(0px)'}))
]);

export const slideOutCards = animation([
  // animate('0s linear', style({ position: 'absolute'})),
  animate('.2s ease-in', style({ height: 0, transform: 'translateY(50px)' })),
]);
