import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightSidebarMenu]'
})

export class HighlightSidebarMenuDirective {

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter(): void{
    this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ffffff1a');
  }
  
  @HostListener('mouseleave') onMouseLeave(): void{
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
  }
  
}
