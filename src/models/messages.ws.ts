
export type Role = "USER" | "ADMIN" | "OWNER";

export interface IWSMessages {
  id: string;
  CreatedAt: Date;
  ReceivedAt: Date;
  content: string;
  username: string;
  channelId: string;
}

export interface IWSError {
  status: number;
  channelId: string;
  content: string;
}

export interface IWSInfos {
  status: number;
  channelId: string;
  content: string;
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
      SubscribedUsers?: UserInfo[];
      username?: string;
  };
}
