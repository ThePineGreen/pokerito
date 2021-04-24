import {animate, animation, style} from '@angular/animations';

export const slideInAnimation = animation([
  style({
    opacity: 0,
    transform: 'translateY(200%)'
  }),
  animate('.3s ease-in', style({opacity: 1, transform: 'translateY(0%)'})),
]);

export const slideOutAnimation = animation([
  animate('.3s ease-in', style({transform: 'translateY(150%)'})),
]);

export const slideInCards = animation([
  style({
    height: 0,
    opacity: 0,
    transform: 'translateY(200%)',
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  }),
  animate('50ms ease-in', style({transform: 'translateY(120%)'})),
  animate('120ms ease-in', style({transform: 'translateY(60%)', opacity: 0.75})),
  animate('150ms ease-in', style({
    transform: 'translateY(0%)',
    height: '*',
    opacity: 1,
    margin: '*',
    paddingTop: '*',
    paddingBottom: '*',
    paddingLeft: '*',
    paddingRight: '*',
  }))
]);

export const slideOutCards = animation([
  animate('50ms ease-in', style({transform: 'translateY(60%)', opacity: 0.75})),
  animate('120ms ease-in', style({transform: 'translateY(120%)', opacity: 0})),
  animate('150ms ease-in', style({
    height: 0,
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  })),
]);
