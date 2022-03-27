import WebSocket from 'ws';

// TODO: this should be placed in an external constants file and not here. but the readme asks to just modify the server files
const WIDGET_URL = 'ws://localhost:3200';
const CHARGER_URL = 'ws://localhost:3100';

function waitForSocketState(socket: WebSocket, state: number) {
    return new Promise<void>(function (resolve) {
        setTimeout(function () {
            if (socket.readyState === state) {
                resolve();
            } else {
                waitForSocketState(socket, state).then(resolve);
            }
        }, 5);
    });
}

describe('Server test', () => {
    it('Should send messages between a charger and its widget', async () => {
        const chargerClient = new WebSocket(`${CHARGER_URL}/c0001`);
        await waitForSocketState(chargerClient, chargerClient.OPEN);

        const widgetClient = new WebSocket(`${WIDGET_URL}/w0001`);
        await waitForSocketState(widgetClient, widgetClient.OPEN);

        let responseMessage;

        widgetClient.on("message", (data) => {
            responseMessage = data;
            widgetClient.close();
        });

        chargerClient.send(JSON.stringify({
            event: "chargingStatus",
            data: {
                soc: "charging",
            },
        }));

        await waitForSocketState(widgetClient, widgetClient.CLOSED);
        expect(responseMessage).toBe(JSON.stringify({"event":"chargingStatus","data":{"status":"charging"}}));
    });
});

