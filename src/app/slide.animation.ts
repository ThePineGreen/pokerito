import {animate, animation, style} from '@angular/animations';

export const slideInAnimation = animation([
  style({opacity: 0, transform: 'translateY(200%)'}),
  animate('.3s ease-in', style({opacity: 1, transform: 'translateY(0%)'})),
]);

export const slideOutAnimation = animation([
  animate('.3s ease-in', style({transform: 'translateY(150%)'})),
]);

export const slideInCards = animation([
  style({transform: 'translateY(210%)'}),
  animate('.3s ease-in', style({transform: 'translateY(0%)'}))
]);

export const slideOutCards = animation([
  animate('.3s ease-in', style({transform: 'translateY(210%)'})),
]);
