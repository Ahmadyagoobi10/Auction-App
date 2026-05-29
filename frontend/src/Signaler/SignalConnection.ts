import * as signalR from "@microsoft/signalr";

export const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5039/auctionHub")
  .withAutomaticReconnect()
  .build();