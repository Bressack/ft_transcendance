
export interface IWSMessages {
  id: string;
  username: string;
  timestamp: string;
  channelId: string;
  content: string;
  passwords: string;
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
