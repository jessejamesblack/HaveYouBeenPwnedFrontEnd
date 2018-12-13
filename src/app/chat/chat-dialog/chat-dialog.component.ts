import { Component, OnInit } from '@angular/core';
import { ChatService, Message, Content } from '../../chat.service';
import { Observable } from 'rxjs';
import { scan } from "rxjs/operators";



@Component({
  selector: "chat-dialog",
  templateUrl: "./chat-dialog.component.html",
  styleUrls: ["./chat-dialog.component.css"]
})
export class ChatDialogComponent implements OnInit {
  messages: Observable<Message[]>;
  formValue: string;
  locations: Content[]=[];

  constructor(public chat: ChatService) {}

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation
      .asObservable()
      .pipe(scan((acc, val) => acc.concat(val)));
    this.locations = this.chat.locationsFound;
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = "";
  }
}