import WebSocket from 'ws';

enum CharginStatus {
    charging = 'charging',
    charging80 = 'charging80',
    charged = 'charged'
};

const chargersWidgetMap = new Map<string, { widget: string }>();
chargersWidgetMap.set('c0001', {widget: 'w0001'});
chargersWidgetMap.set('c0002', {widget: 'w0002'});
chargersWidgetMap.set('c1234', {widget: 'wABCD'});

const widgetWebSocketsMap = new Map<string, WebSocket>();

function getDeviceId(url: string) {
    // TODO: can this be done in a better way ? more fancy
    const splitUrl = url && url.split('/');
    return splitUrl && splitUrl[splitUrl.length - 1];
}

function getChargingStatus(soc: number) {
    if (soc === 100) {
        return CharginStatus.charged;
    } else if (soc >= 80) {
        return CharginStatus.charging80;
    }
    return CharginStatus.charging;
}

function createChargersServer(port = 3100): WebSocket.Server {
    const wss = new WebSocket.Server({port});

    wss.on('connection', (ws, req) => {
        console.log('Charger connection attempt to: ', req.url);

        const chargerId = req.url && getDeviceId(req.url);

        ws.on('message', (message) => {
            let chargingValue: number | undefined;

            if (typeof message === 'string') {
                chargingValue = JSON.parse(message).data.soc;
            }

            const widgetID = chargerId && chargersWidgetMap.get(chargerId)?.widget;

            // TODO: improve this typing
            const widgetWebsocket: "" | undefined | WebSocket = widgetID && widgetWebSocketsMap.get(widgetID);

            if (chargingValue) {
                const messageToSend = {
                    event: 'chargingStatus',
                    data: {
                        status: getChargingStatus(chargingValue),
                    }
                }

                widgetWebsocket && widgetWebsocket.send(JSON.stringify(messageToSend), {}, (err: Error) => {
                    if (err) {
                        console.log('error sending message to widget: ', widgetID);
                    } else {
                        console.log('message delivered successfully from server to widget: ', widgetID);
                    }
                });
            }
        });

        ws.on('close', () => {
            console.log('charger connection closed');
        });
    });

    return wss;
}

function createWidgetsServer(port = 3200): WebSocket.Server {
    const wss = new WebSocket.Server({port});

    wss.on('connection', (ws, req) => {
        console.log('Widget connection attempt to: ', req.url);

        const widgetId = req.url && getDeviceId(req.url);
        widgetId && widgetWebSocketsMap.set(widgetId, ws);

        ws.on('close', () => {
            console.log('widget connection closed');
        });
    });

    return wss;
}

createChargersServer();
createWidgetsServer();
console.log('Servers ON');
