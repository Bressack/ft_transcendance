
import {
  eSubscriptionState,
  eRole,
  eChannelType,
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

export interface join_channel_output {
    channelId           : string;
    name                : string;
    channel_type        : eChannelType;
    state               : eSubscriptionState;
    stateActiveUntil    : Date | null;
    messages            : Message[];
    role                : eRole;
    SubscribedUsers     : UserInfo[];
    username            : string;
    password_protected  : boolean;
};

type ChannelInstanceState = 'CONNECTED' | 'DISCONNECTED'

export class Channel implements join_channel_output {

  vue                 : any;
  password            : string;
  instanceState       : ChannelInstanceState;

  channelId           : string;
  name                : string;
  channel_type        : eChannelType;
  state               : eSubscriptionState;
  stateActiveUntil    : Date | null;
  messages            : Message[];
  role                : eRole;
  SubscribedUsers     : UserInfo[];
  username            : string;
  password_protected  : boolean;

  constructor(vue: any, channelId: string, password: string) {
    // local variables
    this.vue                 = vue
    this.password            = password
    this.instanceState       = 'DISCONNECTED'

    // from server
    this.channelId           = channelId
    this.name                = ''
    this.channel_type        = 'PUBLIC'
    this.state               = 'OK'
    this.stateActiveUntil    = null
    this.messages            = []
    this.role                = 'USER'
    this.SubscribedUsers     = []
    this.username            = ''
    this.password_protected  = false
  }

  assign(payload: join_channel_output) {
    this.channelId          = payload.channelId;
    this.name               = payload.name;
    this.channel_type       = payload.channel_type;
    this.state              = payload.state;
    this.stateActiveUntil   = payload.stateActiveUntil;
    this.messages           = payload.messages;
    this.role               = payload.role;
    this.SubscribedUsers    = payload.SubscribedUsers;
    this.username           = payload.username;
    this.password_protected = payload.password_protected;
  }

  isConnected () {
    return this.instanceState === 'CONNECTED'
  }

  async join () {
    if (this.isConnected())
      throw 'already connected'
    var channelDTO = null
    // try to join channel from api
    try {
      channelDTO = await this.vue.$api.joinChannel(this.channelId, this.password)
    } catch (error) {
      throw 'unable to join channel: ' + error
    }
    // assign datas to instance
    this.assign(channelDTO)
    this.instanceState = 'CONNECTED'
  }

  async leave() {
    if (!this.isConnected())
      throw 'already disconnected'
    // try to join channel from api
    try {
      await this.vue.$api.leaveChannel(this.channelId)
    } catch (error) {
      throw 'unable to leave channel: ' + error
    }
    this.instanceState = 'DISCONNECTED'
  }

  async sendMessage() {
  }

}
