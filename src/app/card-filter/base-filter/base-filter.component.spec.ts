import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFilterComponent } from './base-filter.component';

describe('BaseFilterComponent', () => {
  let component: BaseFilterComponent;
  let fixture: ComponentFixture<BaseFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFilterComponent]
    });
    fixture = TestBed.createComponent(BaseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
