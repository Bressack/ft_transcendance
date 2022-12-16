///////////////////////////////////////////////////////////////////////////////
export interface IGameQuery {
  skip: string;
  take: string;
  order: string;
}

export function GameQueryBuilder(query: IGameQuery) {
  let query_str: string = "?";

  if (query?.order) query_str += "order=" + query?.order + "&";
  if (query?.skip) query_str += "skip=" + query?.skip + "&";
  if (query?.take) query_str += "take=" + query?.take + "&";

  return query_str;
}
///////////////////////////////////////////////////////////////////////////////
export interface ISearchQuery {
  key: string;
  skip?: string;
  take?: string;
}

export function SearchQueryBuilder(query: ISearchQuery) {
  let query_str: string = "?";

  if (query?.key) query_str += "key=" + query?.key + "&";
  if (query?.skip) query_str += "skip=" + query?.skip + "&";
  if (query?.take) query_str += "take=" + query?.take + "&";

  return query_str;
}
///////////////////////////////////////////////////////////////////////////////

enum eSubscriptionState {
  BLACKLISTED,
  WHITELISTED,
}

enum eRole {
  OWNER,
  ADMIN,
  USER,
}

/*
** User
*/
export class User implements IUser {
  username                      : String;
  email                         : String;
  createdAt                     : String;
  updatedAt                     : String;
  TwoFA                         : Boolean;
  password                      : String;
  salt                          : String;
  identification_token          : String;
  refresh_token                 : String;
  channelSubscriptions          : Subscription[];
  messages                      : Message[];
  gameHistoryPOne               : Game[];
  gameHistoryPTwo               : Game[];
  followedBy                    : Follows[];
  following                     : Follows[];
  blockedBy                     : Blocks[];
  blocking                      : Blocks[];
  avatars                       : Avatar;
  victoriesAsPOne               : Number;
  victoriesAsPTwo               : Number;
  defeatsAsPOne                 : Number;
  defeatsAsPTwo                 : Number;

  constructor(
    username                      : String,
    email                         : String,
    createdAt                     : String,
    updatedAt                     : String,
    TwoFA                         : Boolean,
    password                      : String,
    salt                          : String,
    identification_token          : String,
    refresh_token                 : String,
    channelSubscriptions          : Subscription[],
    messages                      : Message[],
    gameHistoryPOne               : Game[],
    gameHistoryPTwo               : Game[],
    followedBy                    : Follows[],
    following                     : Follows[],
    blockedBy                     : Blocks[],
    blocking                      : Blocks[],
    avatars                       : Avatar,
    victoriesAsPOne               : Number,
    victoriesAsPTwo               : Number,
    defeatsAsPOne                 : Number,
    defeatsAsPTwo                 : Number,
  ) {
    this.username                       = username;
    this.email                          = email;
    this.createdAt                      = createdAt;
    this.updatedAt                      = updatedAt;
    this.TwoFA                          = TwoFA;
    this.password                       = password;
    this.salt                           = salt;
    this.identification_token           = identification_token;
    this.refresh_token                  = refresh_token;
    this.channelSubscriptions           = channelSubscriptions;
    this.messages                       = messages;
    this.gameHistoryPOne                = gameHistoryPOne;
    this.gameHistoryPTwo                = gameHistoryPTwo;
    this.followedBy                     = followedBy;
    this.following                      = following;
    this.blockedBy                      = blockedBy;
    this.blocking                       = blocking;
    this.avatars                        = avatars;
    this.victoriesAsPOne                = victoriesAsPOne;
    this.victoriesAsPTwo                = victoriesAsPTwo;
    this.defeatsAsPOne                  = defeatsAsPOne;
    this.defeatsAsPTwo                  = defeatsAsPTwo;
  }
}
interface IUser {
  username                      : String;
  email                         : String;
  createdAt                     : String;
  updatedAt                     : String;
  TwoFA                         : Boolean;
  password                      : String;
  salt                          : String;
  identification_token          : String;
  refresh_token                 : String;
  channelSubscriptions          : Subscription[];
  messages                      : Message[];
  gameHistoryPOne               : Game[];
  gameHistoryPTwo               : Game[];
  followedBy                    : Follows[];
  following                     : Follows[];
  blockedBy                     : Blocks[];
  blocking                      : Blocks[];
  avatars                       : Avatar;
  victoriesAsPOne               : Number;
  victoriesAsPTwo               : Number;
  defeatsAsPOne                 : Number;
  defeatsAsPTwo                 : Number;
}

/*
** Follows
*/
export class Follows implements IFollows {
  follower                      : User;
  followerId                    : String;
  following                     : User;
  followingId                   : String;
  id                            : String;

  constructor(
    follower                      : User,
    followerId                    : String,
    following                     : User,
    followingId                   : String,
    id                            : String,
  ) {
    this.follower                       = follower;
    this.followerId                     = followerId;
    this.following                      = following;
    this.followingId                    = followingId;
    this.id                             = id;
  }
}
interface IFollows {
  follower                      : User;
  followerId                    : String;
  following                     : User;
  followingId                   : String;
  id                            : String;
}

/*
** Blocks
*/
export class Blocks implements IBlocks {
  blocker                       : User;
  blockerId                     : String;
  blocking                      : User;
  blockingId                    : String;
  id                            : String;

  constructor(
    blocker                       : User,
    blockerId                     : String,
    blocking                      : User,
    blockingId                    : String,
    id                            : String,
  ) {
    this.blocker                        = blocker;
    this.blockerId                      = blockerId;
    this.blocking                       = blocking;
    this.blockingId                     = blockingId;
    this.id                             = id;
  }
}
interface IBlocks {
  blocker                       : User;
  blockerId                     : String;
  blocking                      : User;
  blockingId                    : String;
  id                            : String;
}

/*
** Message
*/
export class Message implements IMessage {
  id                            : String;
  CreatedAt                     : String;
  ReceivedAt                    : String;
  content                       : String;
  user                          : User;
  username                      : String;
  channel                       : Channel;
  channelId                     : String;

  constructor(
    id                            : String,
    CreatedAt                     : String,
    ReceivedAt                    : String,
    content                       : String,
    user                          : User,
    username                      : String,
    channel                       : Channel,
    channelId                     : String,
  ) {
    this.id                             = id;
    this.CreatedAt                      = CreatedAt;
    this.ReceivedAt                     = ReceivedAt;
    this.content                        = content;
    this.user                           = user;
    this.username                       = username;
    this.channel                        = channel;
    this.channelId                      = channelId;
  }
}
interface IMessage {
  id                            : String;
  CreatedAt                     : String;
  ReceivedAt                    : String;
  content                       : String;
  user                          : User;
  username                      : String;
  channel                       : Channel;
  channelId                     : String;
}

/*
** Channel
*/
export class Channel implements IChannel {
  id                            : String;
  name                          : String;
  createdAt                     : String;
  updated                       : String;
  ispublic                      : Boolean;
  SubscribedUsers               : Subscription[];
  Message                       : Message[];
  hash                          : String;
  salt                          : String;

  constructor(
    id                            : String,
    name                          : String,
    createdAt                     : String,
    updated                       : String,
    ispublic                      : Boolean,
    SubscribedUsers               : Subscription[],
    Message                       : Message[],
    hash                          : String,
    salt                          : String,
  ) {
    this.id                             = id;
    this.name                           = name;
    this.createdAt                      = createdAt;
    this.updated                        = updated;
    this.ispublic                       = ispublic;
    this.SubscribedUsers                = SubscribedUsers;
    this.Message                        = Message;
    this.hash                           = hash;
    this.salt                           = salt;
  }
}
interface IChannel {
  id                            : String;
  name                          : String;
  createdAt                     : String;
  updated                       : String;
  ispublic                      : Boolean;
  SubscribedUsers               : Subscription[];
  Message                       : Message[];
  hash                          : String;
  salt                          : String;
}

/*
** Subscription
*/
export class Subscription implements ISubscription {
  id                            : String;
  role                          : eRole;
  channel                       : Channel;
  user                          : User;
  username                      : String;
  channelId                     : String;
  state                         : eSubscriptionState;
  blockedUntil                  : String;

  constructor(
    id                            : String,
    role                          : eRole,
    channel                       : Channel,
    user                          : User,
    username                      : String,
    channelId                     : String,
    state                         : eSubscriptionState,
    blockedUntil                  : String,
  ) {
    this.id                             = id;
    this.role                           = role;
    this.channel                        = channel;
    this.user                           = user;
    this.username                       = username;
    this.channelId                      = channelId;
    this.state                          = state;
    this.blockedUntil                   = blockedUntil;
  }
}
interface ISubscription {
  id                            : String;
  role                          : eRole;
  channel                       : Channel;
  user                          : User;
  username                      : String;
  channelId                     : String;
  state                         : eSubscriptionState;
  blockedUntil                  : String;
}

/*
** Game
*/
export class Game implements IGame {
  id                            : String;
  finishedAt                    : String;
  startedAt                     : String;
  score_playerOne               : Number;
  score_playerTwo               : Number;
  playerOne                     : User;
  playerOneName                 : String;
  playerTwo                     : User;
  playerTwoName                 : String;

  constructor(
    id                            : String,
    finishedAt                    : String,
    startedAt                     : String,
    score_playerOne               : Number,
    score_playerTwo               : Number,
    playerOne                     : User,
    playerOneName                 : String,
    playerTwo                     : User,
    playerTwoName                 : String,
  ) {
    this.id                             = id;
    this.finishedAt                     = finishedAt;
    this.startedAt                      = startedAt;
    this.score_playerOne                = score_playerOne;
    this.score_playerTwo                = score_playerTwo;
    this.playerOne                      = playerOne;
    this.playerOneName                  = playerOneName;
    this.playerTwo                      = playerTwo;
    this.playerTwoName                  = playerTwoName;
  }
}
interface IGame {
  id                            : String;
  finishedAt                    : String;
  startedAt                     : String;
  score_playerOne               : Number;
  score_playerTwo               : Number;
  playerOne                     : User;
  playerOneName                 : String;
  playerTwo                     : User;
  playerTwoName                 : String;
}

/*
** Avatar
*/
export class Avatar implements IAvatar {
  id                            : String;
  updatedAt                     : String;
  createdAt                     : String;
  user                          : User;
  username                      : String;
  linkOriginal                  : String;
  linkThumbnail                 : String;
  linkMedium                    : String;
  linkLarge                     : String;

  constructor(
    id                            : String,
    updatedAt                     : String,
    createdAt                     : String,
    user                          : User,
    username                      : String,
    linkOriginal                  : String,
    linkThumbnail                 : String,
    linkMedium                    : String,
    linkLarge                     : String,
  ) {
    this.id                             = id;
    this.updatedAt                      = updatedAt;
    this.createdAt                      = createdAt;
    this.user                           = user;
    this.username                       = username;
    this.linkOriginal                   = linkOriginal;
    this.linkThumbnail                  = linkThumbnail;
    this.linkMedium                     = linkMedium;
    this.linkLarge                      = linkLarge;
  }
}
interface IAvatar {
  id                            : String;
  updatedAt                     : String;
  createdAt                     : String;
  user                          : User;
  username                      : String;
  linkOriginal                  : String;
  linkThumbnail                 : String;
  linkMedium                    : String;
  linkLarge                     : String;
}
