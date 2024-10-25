import { Injectable } from '@angular/core';

declare var alertify: any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  message(message: string,  options? : Partial<AlertifyOptions>){
    const defaultOptions = new AlertifyOptions();
    const currentOptions = { ...defaultOptions, ...options };

    alertify.set('notifier','delay', currentOptions.delay);
    alertify.set('notifier','position', currentOptions.position);
    const msj = alertify[currentOptions.messageType](message);
    if(currentOptions.dismissOthers){
      msj.dismissOthers();
  }
  }

  dismiss(){
    alertify.dismissAll();
  }
  
}

export enum MessageType{
  Error = "error",
  Message= "message",
  Notify = "notify",
  Success= "success",
  Warning= "warning"
}

export enum Position{
  TopCenter = "top-center",
  TopRight = "top-right",
  BottomCenter = "bottom-center",
  TopLeft= "top-left",
  BottomLeft = "bottom-left",
  Bottomright = "bottom-right"
}
export class AlertifyOptions{
  messageType: MessageType = MessageType.Message;
  position: Position = Position.BottomLeft;
  delay: number = 3;
  dismissOthers: boolean =false;
}