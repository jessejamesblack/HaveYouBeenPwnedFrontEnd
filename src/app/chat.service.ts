import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

import { ApiAiClient } from "api-ai-javascript";

import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

export class Content {
  constructor(
    public address: string,
    public distance: string,
    public photo_reference: string,
    public open_now: string
  ) {}
}

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  locationsFound: Content[] = [];

  constructor() {}

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, "user");
    this.update(userMessage);

    return this.client.textRequest(msg).then(res => {
      const speech = res.result.fulfillment.speech;
      // console.log(speech);
      this.retrieveLocations(speech);
      const botMessage = new Message(speech, "bot");
      this.update(botMessage);
    });
  }

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  }

  retrieveLocations(speech: any) {
    var content = "";
    var total = 0;
    for (var i = 0; i < speech.length; i++) {
      if (speech[i] == "\n") {
        var obj = JSON.parse(content);
        console.log(obj);
        var location = new Content(
          obj.address,
          obj.distance,
          obj.photo_reference,
          obj.open_now
        );
        if (obj.open_now == "true") {
          location.open_now = "Open!";
        } else {
          location.open_now = "Closed!";
        }
        total += 1;
        this.addNearby(location, total);
        content = "";
      } else {
        content += speech[i];
      }
    }
  }
  addNearby(location: Content, total: number) {
    if (total <= 3) {
      this.locationsFound[total - 1] = location;
    }
  }
}
