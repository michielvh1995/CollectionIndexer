import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCardVersionsComponent } from './select-card-versions.component';

describe('SelectCardVersionsComponent', () => {
  let component: SelectCardVersionsComponent;
  let fixture: ComponentFixture<SelectCardVersionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCardVersionsComponent]
    });
    fixture = TestBed.createComponent(SelectCardVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
