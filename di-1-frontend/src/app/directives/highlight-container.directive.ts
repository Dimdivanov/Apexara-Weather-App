import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightContainer]'
})

export class HighlightContainerDirective {

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter():void {
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 10px rgba(0, 153, 255, 0.8)');
  }
  
  @HostListener('mouseleave') onMouseLeave(): void{
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }
  
}
