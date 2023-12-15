import { Component, Input } from '@angular/core';
import { MTGSet } from '../../models/MTGSet';
import { FormBuilder, FormControl } from '@angular/forms';


@Component({
  selector: 'app-set-selector',
  templateUrl: '../pages/set-selector.component.html',
  styleUrls: [
    '../pages/set-selector.component.scss',
    '../../../base-filter/base-filter.component.scss'
  ]
})
export class SetSelectorComponent {
  constructor(private fb : FormBuilder) { }

  ngOnInit() {
    this.setupChildSelectors();
  }
  
  @Input() set! : MTGSet ;
  @Input() expanded! : boolean;

  // Form control fields:
  tc = this.fb.array([]);

  setsForm = this.fb.group({
    parentControl: new FormControl(false),
    childSelectors: this.tc
  });

  setupChildSelectors() : void {
    for(const child of this.set.children)
      this.tc.push(this.fb.control(false));
  }

  public ReadData() {
    let sets: string[] = [];

    if(this.setsForm.value.parentControl) sets.push(this.set.code);

    for (let i = 0; i < this.set.children.length; i++) {
      if(this.tc.at(i).value)
        sets.push(this.set.children[i].code);
    }

    return sets;
  }

  public Reset() : void {
    this.setsForm.reset();
  }

}
