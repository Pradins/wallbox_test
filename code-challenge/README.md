# Code challenge

## Context

Wallbox is thinking of diversifying its business, and for this, it is going to launch a new mobile recharge service for various events: music festivals and the like. We at Wallbox are very optimistic about the pandemic 😄

The charging process will be as follows:

A customer approaches the Wallbox booth, hands over his mobile phone and in return receives a device that will indicate the status of the charging process. This device has a led that changes color depending on the state of the charge:

     - red: charging
     - yellow: charge level at least 80%
     - green: fully charged

When the led turns green, the customer can return to the booth, pay for the service and exchange the device for their charged mobile phone.

## Your mission (should you decide to accept it)

Develop a server in which chargers and devices will connect via websockets.

During the charging process, the charger periodically sends the charge level to the server.

The server processes these messages and sends a charging status to the device associated with that charger.

Each charger has a unique device associated with it (for example, the charger _c1234_ is associated with the device _wABCD_)

### Chargers

Chargers connect to the server like this:

```typescript
const connection = new WebSocket("ws://localhost:3100/chargers/c1234");
```

where _c1234_ is the charger id.

The ws messages that the chargers send us indicating their charge level (percentage) (_State of Charge_) are as follows:

```JSON
{
    "event": "StateOfCharge",
    "data": {
      "soc": 70
    }
}
```

### Devices (a.k.a Widgets)

Devices connect to the server like this:

```javascript
const connection = new WebSocket("ws://localhost:3200/widgets/wABCD");
```

where _wABCD_ is the device id.

The devices receive ws messages from the server indicating the charging status (`charging`,` charging80`, and `charged`):

```typescript
connection.send(
  JSON.stringify({
    event: "chargingStatus",
    data: {
      status: "charging",
    },
  })
);
```

The possible state of charge are:

- `charging`
- `charging80`: charge level at 80% or higher
- `charged`: fully charged (100%)

## Support tools

To make your life easier, we have created some mocks of the charger (_charger_) and the device (_widget_). They will help you to validate that what you've done works properly. You should launch each one in a different terminal.

### Charger mock

```bash
npm run start:charger
```

It connects to your server and allows you to send charge level messages.

### Device mock

```bash
npm run start:widget
```

It connects to your server and displays the status it receives on the screen.

## Aspects to consider:

- It should take you about 1-2 hours to get it done. Your code should be simple, understandable, and conform to the statement. Do it as clean as you consider but do not do more than what is asked of you to do. **Write code only in the `./server/index.ts` and `./server/e2e.spec.ts` files**, please do not add any more files or folders. As you will see there, we have already put in place some boilerplate code, please use it since it will be helpful to you. Although we have used a functional approach, you can rewrite it to OOP if you feel more comfortable with it.

- (Node> = 12) && (JavaScript || TypeScript) [Better with typescript!]

- You may use any framework / library that you deem helpful in the development. The only requirement is that you use the _ws_ library (https://github.com/websockets/ws/) for the Websockets. The test could actually be done using just this library.

- You don't need to use any database (SQL / NoSQL). As you will see in our boilerplate code, the association between chargers and devices is stored in memory. For this test, the _c1234_ charger will be associated with the _wABCD_ device.

- We want you to include some E2E tests (charger -> server -> device), like: _When I receive a certain message from a charger, I should send this other message to the associated device_. You don't have to run a comprehensive test suite. We just want to see how you would do automatic testing with Websockets communications. Mocha or Jest, up to you. Write all your test suites in the `./server/e2e.spec.ts` file.

- Add instructions on how to run your code and launch the test suites. You may use Docker, although it is not necessary.

- If you want, initialize an empty git repository. It is always great to wrap work in small and descriptive commits 😉

- Use the servers we have provided in the `.server/index.ts` boilerplate code, respecting ports `3100` and `3200` for both charger and widget servers, respectively.

- DO NOT edit anything in the in the `widget` and `charger` folders. As mentioned, use only the `./server/index.ts` file for your implementation and the `server/e2e.spec.ts` for your e2e tests.



## Notes from the candidate

- Maybe the approach for the tests is not the best one or the one you wanted me to do. I decided to mock the widget and the charger. by triggering events from the charger and the widget I check the expected messages reach the widget. It looks like more aa unit test of the Server to me and not a complete test of the integration between the three components. But is what i could do without changing the rest of the components.
- I would like to unit test some events in the server like: a charger sends a message but it does not have a widget associated in the map -> an exception or event is triggered etc. But i didnt see how to test that without changing alot the existing code.
- I created a dockerfile to run the tests. So running after the instalation of the dependencies "npm run test_local" should create an instance of the server in a Docker container and run the tests against it.
- We do technical tests in my company but we dont provide such a nice working suite like the one you do [charger -> server -> widget]. Doing the test and seeing that the messages from the charger were showing with colors in the widget terminal was so nice. So kudos to whoever decided to go this way for the technical test and congratulations to the ones who coded it. I dont know if my test was successfull or not. but it was fun :)
