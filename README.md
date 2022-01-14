# Private Test Blockchain Application for Astronomers
The goal of this blockchain is to create a test application that allows astronomers to register stars and track the ownership of each.

## Initialization

Install dependencies
```
npm install
```

Run the application

```
node app.js
```

Test the application by using Postman to get the Genesis block
```
GET: http://localhost:8000/block/height/0
```

You should get a response like this 👇
```
{
    "hash": "e2a1f4219f83a218077f101077cce933b8ed045976aeb848a9260900c9bdfbee",
    "height": 0,
    "body": "7b2264617461223a2247656e6573697320426c6f636b227d",
    "time": "1642199851",
    "previousBlockHash": null
}
```




