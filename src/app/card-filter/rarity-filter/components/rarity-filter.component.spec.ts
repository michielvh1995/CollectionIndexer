import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RarityFilterComponent } from './rarity-filter.component';

describe('RarityFilterComponent', () => {
  let component: RarityFilterComponent;
  let fixture: ComponentFixture<RarityFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RarityFilterComponent]
    });
    fixture = TestBed.createComponent(RarityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
