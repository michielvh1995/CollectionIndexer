import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCollectionOverviewComponent } from './card-collection-overview.component';

describe('CardCollectionOverviewComponent', () => {
  let component: CardCollectionOverviewComponent;
  let fixture: ComponentFixture<CardCollectionOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCollectionOverviewComponent]
    });
    fixture = TestBed.createComponent(CardCollectionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
