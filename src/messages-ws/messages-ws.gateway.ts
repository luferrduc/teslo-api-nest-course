import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@/auth/interfaces';

@WebSocketGateway({ cors: true })     // Para poder saber que cliente se conecta o desconecta
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect()
      return;
    }

    // console.log({ payload })
    // console.log('Cliente conectado:', client.id)
    // this.messagesWsService.registerClient(client, payload.id)
    // Se ocupa el Server (wss) para emitir hacia todos los clientes que     
    // están escuchando el evento de forma simultanea
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())  
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado:', client.id)
    this.messagesWsService.removeClient(client.id)
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())  

  }
  
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload)

    //! Emitir unicamente al cliente inicial
    // client.emit('messages-from-server', {
    //   fullName: 'Luciano',
    //   message: payload.message || 'No hay mensaje'
    // })

    //! Emitir a todos MENOS al cliente inicial
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'Luciano',
    //   message: payload.message || 'No hay mensaje'
    // })

    //! Emitir a todos
    this.wss.emit('messages-from-server', {
        fullName: this.messagesWsService.getUserFullName(client.id),
        message: payload.message || 'No hay mensaje'
    })
  }

}
