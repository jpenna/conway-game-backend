# Conway's Game of Life (Backend)

This is a multiplayer backend server to the *Conway's Game of Life* (found here: https://github.com/jpenna/conway-game).

## TODO

Check the TODO to know the next features: [./TODO.md](TODO).

## Get Started

Copy `.env.example` to `.env` and set up the environment variables.

```bash
# Install dependencies
npm install
```

```bash
# Start server
npm start
```

```bash
# Runs npm start with nodemon (should be installed globally)
npm run watch
```

```bash
# Run tests
npm test
```

```bash
# Run tests
npm run watch
```

## CommonJs

I am using CommonJs modules in this project just because ES Modules are still
Experimental under Node.js 10.x (https://nodejs.org/docs/latest-v10.x/api/esm.html).

## Functionality

The backend job is to synchronize the players inside the room and new players. 

> Currently, there are a lot of inefficient messages
> (i.e., changes in one player broadcast all players and whole world), there is no handling of a player that joins the room
> in the middle of a game and there are missing tests (even though the main cases are described already).

To do this, the communication between client and server is done using WebSocket
([ws](https://www.npmjs.com/package/ws)).
To configure the room and include new players while the game is not started is straight forward:
just send to the server, validate, store (in memory, no database for this application) and synchronize the state.
After the game is running involves more attention.

After a certain amount of rounds, a snapshot of the current state will be sent to the server and checked between the clients.  
On inconsistances, the server will update the clients with the majority's state.  
The server will store this snapshot, so any other player requesting for this information
will be able to recompute the current state based on this snapshot.

## Tradeoffs

For simplicity, the server is broadcasting the whole state for every change. This is just for demo purposes
(the frontend README talks more about this).

The server should only keep and validate the state, it should not do calculations. Currently, when there are
updates in the world, the server calculates the new value and send it to the client, overwriting what was
calculated in the client. This is inefficient and weird to the UX. One way to solve this is to validate the
new state, send an ACK and broadcast the change to other players. On clash, a simple "first in, first served"
approach may solve the issue.
