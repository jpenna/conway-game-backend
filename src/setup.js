module.exports = (wss) => {
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.send('something');
  });
};
