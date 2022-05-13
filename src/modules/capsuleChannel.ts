import { Channel, ChannelEvents } from '@anycable/core'

type home = {
  home: string
}

type Params = home

type EnterMessage = {
    type: 'enter';
    init_data: object[];
    entering_user: object;
}

type Message = EnterMessage 

interface Events extends ChannelEvents<Message> {
    enterRoom: (msg: EnterMessage) => void;
}


export class CapsuleChannel extends Channel<Params, Message, Events> {
    static identifier = 'CapsuleChannel';

    receive(message: Message) {
        if (message.type === 'enter') {
            return this.emit('enterRoom', message);
        }
        return super.receive(message);

    }
}
