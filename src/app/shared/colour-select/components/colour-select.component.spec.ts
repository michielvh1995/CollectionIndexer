import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourSelectComponent } from './colour-select.component';

describe('ColourSelectComponent', () => {
  let component: ColourSelectComponent;
  let fixture: ComponentFixture<ColourSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColourSelectComponent]
    });
    fixture = TestBed.createComponent(ColourSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
