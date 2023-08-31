import { Component } from '@angular/core';
import { MessageService } from '../services/messages.service';

@Component({
  selector: 'app-messages',
  templateUrl: '../pages/messages.component.html',
  styleUrls: ['../pages/messages.component.scss']
})
export class MessagesComponent {
  constructor(public messageService: MessageService) {}

}
