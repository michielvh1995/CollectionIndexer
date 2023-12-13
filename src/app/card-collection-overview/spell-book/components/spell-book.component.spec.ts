import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellBookComponent } from './spell-book.component';

describe('SpellBookComponent', () => {
  let component: SpellBookComponent;
  let fixture: ComponentFixture<SpellBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpellBookComponent]
    });
    fixture = TestBed.createComponent(SpellBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
