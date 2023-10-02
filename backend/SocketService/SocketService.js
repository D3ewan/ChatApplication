const socketIo = require('socket.io');

class SocketService {
  constructor(server) {
    this.io = socketIo(server, {cors: {origin: '*'}});
    this.io.on('connection', socket => {
      socket.on('send-message', message => {
          socket.broadcast.emit('recieve-message', message)
      })
  
      socket.on('send-status', status => {
          socket.broadcast.emit('recieve-status', status)
      })
  
      socket.on('send-typingEffect', effect => {
          socket.broadcast.emit('recieve-typingEffect', effect)
      })
    });
  } 

  emiter(event, body) {
    if(body)
      this.io.emit(event, body);
  }
}

module.exports = SocketService;