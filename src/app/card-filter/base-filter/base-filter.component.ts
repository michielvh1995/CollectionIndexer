import { Component } from '@angular/core';
import { BaseSelection } from '../../shared/models/filters';

@Component({
  selector: 'app-base-filter',
  templateUrl: './base-filter.component.html',
  styleUrls: ['./base-filter.component.scss']
})
export abstract class BaseFilterComponent {
  public abstract Disable() : void;
  public abstract Enable() : void;
  public abstract Validate() : boolean;
  public abstract ReadData() : BaseSelection;
  public abstract Reset() : void;
}
