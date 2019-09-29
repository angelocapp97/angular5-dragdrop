import { Directive, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { DraggableDirective } from './draggable.directive';

interface SortEvent {
  currentIndex: number;
  newIndex: number;
}

@Directive({
  selector: '[appSortableList]'
})
export class SortableListDirective implements AfterContentInit {
  @ContentChildren(DraggableDirective) sortables: QueryList<DraggableDirective>;

  @Output() sort = new EventEmitter<SortEvent>();

  private clientRects: ClientRect[];

  ngAfterContentInit(): void {
    this.sortables.forEach(sortable => {
      sortable.dragStart.subscribe(() => this.measureClientRects());
      sortable.dragMove.subscribe((event: PointerEvent) => this.detectSorting(sortable, event));
    });
  }

  private measureClientRects() {
    this.clientRects = this.sortables.map(sortable => sortable.element.nativeElement.getBoundingClientRect());
  }

  detectSorting(sortable: DraggableDirective, event: PointerEvent) {
    const currentIndex = this.sortables.toArray().indexOf(sortable);

    const prevRect = currentIndex > 0 ? this.clientRects[currentIndex - 1] : undefined;
    const nextRect = currentIndex < this.clientRects.length - 1 ? this.clientRects[currentIndex + 1] : undefined;

    if (prevRect && event.clientY < prevRect.top + prevRect.height / 2) {
      this.sort.emit({
        currentIndex,
        newIndex: currentIndex - 1
      });
    } else if (nextRect && event.clientY > nextRect.top + nextRect.height / 2) {
      this.sort.emit({
        currentIndex,
        newIndex: currentIndex + 1
      });
    }

    // console.log('currentIndex', currentIndex);
    // console.log('prevRect', prevRect);
    // console.log('nextRect', nextRect);
  }
}
