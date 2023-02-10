import {
  User,
  Follows,
  Blocks,
  Message,
  Channel,
  Subscription,
  Game,
  Avatar,
  eSubscriptionState,
  eRole,
  eChannelType,
} from 'src/services/api.models'

export type Role = "USER" | "ADMIN" | "OWNER";
export type MessageStatus = "OK" | "INVALID_PASSWORD" | "UNAUTHORIZED" | "MESSAGE_TOO_LONG" | "MESSAGE_TOO_SHORT" | "INVALID_TIMESTAMP" | "DATABASE_ERROR" | "INVALID_CHANNEL";

export interface IWSMessages {
  id: string;
  CreatedAt: Date;
  ReceivedAt: Date;
  content: string;
  username: string;
  channel_id: string;
}

export interface Message_Aknowledgement_output {
  status: MessageStatus;
  channelId: string;
  comment?: string;
};

export interface IWSError {
  data: Object
  message: string
  status: string
}

export interface IWSInfos {
  data: Object
  message: string
  status: string
}

export interface IUserInfos {
  username: string;
  role: Role;
}

export interface IJoinChannelPayload {
  status: "OK" | "error";
  message?: string;
  data: {
      channelId?: string;
      name?: string;
      channel_type?: eChannelType;
      state?: eSubscriptionState;
      stateActiveUntil?: Date;
      messages?: Message[];
      role?: eRole;
      SubscribedUsers?: Subscription[];
      username?: string;
  };
}
