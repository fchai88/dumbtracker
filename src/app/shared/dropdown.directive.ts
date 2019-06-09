// NOTE: This is a revised way so that dropdown will close anywhere on document. 
import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})

export class DropdownDirective {
  @HostBinding('class.show') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    let divChildElement = this.elRef.nativeElement.children[1];
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;

    if (this.isOpen) {
      this.renderer.addClass(divChildElement, 'show');
    } else {
      this.renderer.removeClass(divChildElement, 'show');
    }

  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}

// NOTE: The initial way of doing custom dropdown, however this would only open and CLOSE when tapping the dropdown
// import { Directive, ElementRef, Renderer2, HostListener, OnInit, ViewChild } from '@angular/core';

// @Directive({
//   selector: '[appDropdown]'
// })
// export class DropdownDirective implements OnInit {
//   isExpanded: boolean;

//   constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

//   ngOnInit() {
//     this.isExpanded = false;
//   }

//   @HostListener('click') toggleOpen() {
//     this.isExpanded = !this.isExpanded;
//     let divChildElement = this.elementRef.nativeElement.children[1];

//     if (this.isExpanded) {
//       this.renderer.addClass(this.elementRef.nativeElement, 'show');
//       this.renderer.addClass(divChildElement, 'show');
//     }
//     else {
//       this.renderer.removeClass(this.elementRef.nativeElement, 'show');
//       this.renderer.removeClass(divChildElement, 'show');
//     }
//   }

// }