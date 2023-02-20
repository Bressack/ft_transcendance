
import api from 'src/services/api.service'

import {
  eSubscriptionState,
  eRole,
  eChannelType,
  Subscription,
} from "src/services/api.models";

type Message = {
  id                            : string;
  CreatedAt                     : string;
  ReceivedAt                    : string;
  content                       : string;
  username                      : string;
  channelId                     : string;
}

export interface UserInfo {
  username: string;
  role: eRole;
};

export interface join_channel_output_payload {
    data: join_channel_output
}
export interface join_channel_output {
    channelId           : string;
    name                : string;
    channel_type        : eChannelType;
    state               : eSubscriptionState;
    stateActiveUntil    : Date | null;
    messages            : Message[];
    role                : eRole;
    SubscribedUsers     : Map<string, Subscription>;
    username            : string;
    password_protected  : boolean;
};

type ChannelInstanceState = 'CONNECTED' | 'DISCONNECTED'

export class Channel implements join_channel_output {

  password            : string | null;
  instanceState       : ChannelInstanceState | null;

  channelId           : string;
  name                : string;
  channel_type        : eChannelType;
  state               : eSubscriptionState;
  stateActiveUntil    : Date | null;
  messages            : Message[];
  role                : eRole;
  SubscribedUsers     : Map<string, Subscription>;
  username            : string;
  password_protected  : boolean;

  constructor(channelId: string) {
    // local variables
    this.password            = null
    this.instanceState       = 'DISCONNECTED'

    // from server
    this.channelId           = channelId
    this.name                = ''
    this.channel_type        = 'PUBLIC'
    this.state               = 'OK'
    this.stateActiveUntil    = null
    this.messages            = []
    this.role                = 'USER'
    this.SubscribedUsers     = new Map<string, Subscription>() as Map<string, Subscription>,
    this.username            = ''
    this.password_protected  = false
  }

  assign(p: join_channel_output) {
    this.channelId          = p.channelId;
    this.name               = p.name;
    this.channel_type       = p.channel_type;
    this.state              = p.state;
    this.stateActiveUntil   = p.stateActiveUntil;
    this.messages           = p.messages;
    this.role               = p.role;
    this.username           = p.username;
    this.password_protected = p.password_protected;

    this.SubscribedUsers.clear()
    p.SubscribedUsers.forEach((e) => {
      this.SubscribedUsers.set(e.username, e)
    })
  }

  debug() {
    console.log(
      {
        password            : this.password,
        instanceState       : this.instanceState,
        channelId           : this.channelId,
        name                : this.name,
        channel_type        : this.channel_type,
        state               : this.state,
        stateActiveUntil    : this.stateActiveUntil,
        messages            : this.messages,
        role                : this.role,
        SubscribedUsers     : this.SubscribedUsers,
        username            : this.username,
        password_protected  : this.password_protected,
      }
    )
  }

  isConnected ()
  : boolean {
    console.log(`[ channel.ts ] isConnected`);
    return this.instanceState === 'CONNECTED'
  }

  close()
  : void {
    console.log(`[ channel.ts ] close`);
    this.instanceState = 'DISCONNECTED'
  }

/////////////////////////////////////////////
  async join ()
  : Promise<void> {
    this.debug()
    if (this.isConnected())
      throw 'already connected'

    console.log(this.password, this.password_protected);
    var password : string | null = null
    if (this.password_protected && !this.password) {
      password = window.prompt("Enter channel password: ")
      console.log('TOTODKJFSKLFJHLKSDJFKLSDJFK');
      console.log('password:', password + '');

      if (!password) // if user click cancel, just abort
      {
        console.log('Bad Password');
        throw 'Bad Password'
      }
      this.password = password as string
    }
    else
      password = this.password
    console.log('AH ?!!');
    var channelDTO : join_channel_output_payload | null = null
    // try to join channel from api
    try {
      channelDTO = await api.joinChannel(this.channelId, password as string)
      console.log('channelDTO', channelDTO.data);

    } catch (error) {
      throw 'Unable to join the channel: ' + error
    }
    // assign datas to instance
    this.assign(channelDTO.data)
    this.debug()
    this.password = password as string
    this.instanceState = 'CONNECTED'
  }
/////////////////////////////////////////////
  async leave()
  : Promise<void> {
    if (!this.isConnected())
      throw 'already disconnected'
    // try to join channel from api
    try {
      await api.leaveChannel()
    } catch (error) {
      throw 'unable to leave channel: ' + error
    }
    this.close()
  }
/////////////////////////////////////////////
  async sendMessage(text: string)
  : Promise<void> {
    if (!this.isConnected())
      throw 'you are not connected to this channel'

    try {
      await api.sendMessage(this.channelId, this.password as string, text)
    } catch (error) {
      throw 'unable send message: ' + error
    }
  }
/////////////////////////////////////////////
}