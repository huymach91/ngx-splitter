import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';

export enum DirectionEnum {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

@Directive({
  selector: '[ngx-splitter]',
})
export class NgxSplitterDirective implements AfterViewInit, OnDestroy {
  @Input('direction') direction: DirectionEnum = DirectionEnum.horizontal;

  private handler = document.createElement('div');
  private leftSide: any;
  private rightSide: any;

  private handlerStartRef: any;
  private handlerMoveRef: any;
  private handlerEndRef: any;

  private start = {
    clientX: 0,
    clientY: 0,
    leftWidth: 0,
  };
  private isMouseDown: boolean = false;

  constructor(private element: ElementRef) {
    this.handler.style.setProperty('height', '30px');
    this.handler.style.setProperty('width', '100%');
    this.handler.style.setProperty('cursor', 'pointer');
    this.handler.style.setProperty('background-color', '#dee2e6');
  }

  ngAfterViewInit() {
    const splitter = this.element.nativeElement as HTMLDivElement;
    splitter.appendChild(this.handler);
    this.leftSide = splitter.previousElementSibling as HTMLDivElement;
    this.rightSide = splitter.nextElementSibling as HTMLDivElement;

    this.setStyle();
    // handler: start
    this.handlerStartRef = this.onHandlerStart.bind(this);
    this.handler.addEventListener('mousedown', this.handlerStartRef);
  }

  ngOnDestroy() {
    this.handler.removeEventListener('mousedown', this.handlerStartRef);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {
    this.onHandlerMove(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: any) {
    this.onHandlerEnd();
  }

  setStyle() {
    const element = this.element.nativeElement as HTMLDivElement;
    element.style.setProperty(
      'cursor',
      this.direction === DirectionEnum.horizontal ? 'col-resize' : 'row-resize'
    );
    element.style.setProperty('display', 'flex');
    element.style.setProperty('align-items', 'center');
    element.style.setProperty('width', '3px');
    element.style.setProperty('background-color', '#f8f9fa');
    element.style.setProperty('height', '100%');
  }

  private onHandlerStart(event: any) {
    this.isMouseDown = true;
    this.start.clientX = event.clientX;
    this.start.clientY = event.clientY;
    this.start.leftWidth = this.leftSide.getBoundingClientRect().width;
  }

  private onHandlerMove(event: any) {
    if (!this.isMouseDown) return;
    console.log('move');
    const parent = (this.element.nativeElement as HTMLDivElement)
      .parentElement as HTMLDivElement;
    const parentRect = parent.getBoundingClientRect();

    const dx = event.clientX - this.start.clientX;
    const dy = event.clientY - this.start.clientY;
    const newLeftWidth = (
      ((this.start.leftWidth + dx) * 100) /
      parentRect.width
    ).toFixed(2);

    this.leftSide.style.setProperty('width', newLeftWidth + 'px', '!important');
  }

  private onHandlerEnd() {
    this.isMouseDown = false;
  }
}
