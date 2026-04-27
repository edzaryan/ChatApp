import * as signalR from "@microsoft/signalr";

export const createConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7091/chathub", {
      accessTokenFactory: () => localStorage.getItem("token") || ""
    })
    .withAutomaticReconnect()
    .build();
};