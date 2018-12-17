import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from "@angular/core";
import { ChatService, Message, Content } from "../../chat.service";
import { Observable } from "rxjs";
import { scan } from "rxjs/operators";

@Component({
  selector: "chat-dialog",
  templateUrl: "./chat-dialog.component.html",
  styleUrls: ["./chat-dialog.component.css"]
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {
  @ViewChild("target") elemRef: ElementRef;
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  messages: Observable<Message[]>;
  formValue: string;
  locations: Content[] = [];
  isOn: Boolean = false;

  constructor(public chat: ChatService) {}

  ngOnInit() {
    // appends to array after each new message is added to feedSource
    this.messages = this.chat.conversation
      .asObservable()
      .pipe(scan((acc, val) => acc.concat(val)));
    this.locations = this.chat.locationsFound;
    this.scroll();
  }
  ngAfterViewChecked() {
    this.scroll();
  }
  chatWithBot() {
    this.isOn = !this.isOn;
  }
  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = "";
    this.scroll();
  }
  storesNearMe() {
    this.formValue = "find stores near me";
    this.chat.converse(this.formValue);
    this.formValue = "";
    this.scroll();
  }
  scroll() {
    // console.log(this.elemRef.nativeElement.innerHTML);
    // this.elemRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
