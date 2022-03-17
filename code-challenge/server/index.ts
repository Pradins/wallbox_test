import WebSocket from "ws";

const chargersWidgetMap = new Map<string, { widget: string }>();
chargersWidgetMap.set("c0001", { widget: "w0001" });
chargersWidgetMap.set("c0002", { widget: "w0002" });
chargersWidgetMap.set("c1234", { widget: "wABCD" });

const widgetWebSocketsMap = new Map<string, WebSocket>();

function createChargersServer(port = 3100): WebSocket.Server {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws, req) => {
    console.log("Charger connection attempt to: ", req.url);
    ws.on("message", (message) => {
      console.log(message.toString());
    });

    ws.on("close", () => {
      console.log("charger connection closed");
    });
  });

  return wss;
}

function createWidgetsServer(port = 3200): WebSocket.Server {
  const wss = new WebSocket.Server({ port });

  wss.on("connection", (ws, req) => {
    console.log("Widget connection attempt to: ", req.url);
    ws.on("close", () => {
      console.log("widget connection closed");
    });
  });

  return wss;
}

createChargersServer();
createWidgetsServer();
console.log("Servers ON");