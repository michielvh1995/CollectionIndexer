import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSelectorComponent } from './set-selector.component';

describe('SetSelectorComponent', () => {
  let component: SetSelectorComponent;
  let fixture: ComponentFixture<SetSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SetSelectorComponent]
    });
    fixture = TestBed.createComponent(SetSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
