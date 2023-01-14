
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
