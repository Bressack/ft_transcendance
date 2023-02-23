import { defineStore, StateTree } from "pinia";
import { QNotifyOptions } from "quasar";
import * as models from "src/services/api.models";
import { intersection, difference } from "lodash";
import * as ld from "lodash";
import {
    Blocking,
    Channel,
    ChannelSubscription,
    ChannelType,
    FollowedBy,
    Message,
    State,
    StoreData,
    SubscribedUser,
} from "./store.types";
import { Convert } from "./store.validation";

// type NotifyOptions = {
//   type?: string | null;
//   color?: string | null;
//   message: string | null;
//   avatar?: string | null;
//   timeout?: number;
// };

// interface INotification {
//   id: number;
//   createdAt: Date;
//   options: NotifyOptions;
// }

enum UserStatus {
    OFFLINE = "OFFLINE",
    ONLINE = "ONLINE",
    INGAME = "INGAME",
}

// enum eRole {
//   ADMIN = "ADMIN",
//   OWNER = "OWNER",
//   USER = "USER",
// }
// enum eState {
//   OK = "OK",
//   MUTED = "MUTED",
//   BANNED = "BANNED",
// }

// type TSubscriber = {
//   role: eRole;
// };

// enum eChannelType {
//   PRIVATE = "PRIVATE",
//   ONE_TO_ONE = "ONE_TO_ONE",
//   PUBLIC = "PUBLIC",
// }

// type TMessage = {
//   id: string;
//   CreatedAt: Date;
//   ReceivedAt: Date;
//   content: string;
//   username: string;
//   channelId: string;
// };

// type TChannel = {
//   role: eRole;
//   channelId: string;
//   name: string;
//   state: State;
//   stateActiveUntil: Date;
//   channel_type: eChannelType;
//   Subscribers: TSubscriber[];
//   password_protected: boolean;
//   saved_password: string;
//   messages: TMessage[];
// };

type running_game = {
    gameId: string;
    finishedAt?: Date;
    startedAt: Date;
    score_playerOne?: number;
    score_playerTwo?: number;
    playerOneName: string;
    playerTwoName: string;
    map: string;
};

type InternalAppInfos = {
    drawerStatus: boolean;
    //   notifications: INotification[];
    ws_connected: boolean;
    users_status: Map<string, UserStatus>;
    active_channel: string;
    channels_passwords: Map<string, string>;
    running_games: running_game[];
};

type MainStoreState = StoreData & InternalAppInfos;
// THE MEGA STORE
const useMainStore = defineStore<"main-store", MainStoreState, any, any>(
    "main-store",
    {
        state: (): MainStoreState => {
            return {
                username: "",
                email: "",
                twoFA: false,
                channelSubscriptions: [],
                followedBy: [],
                following: [],
                blocking: [],
                victoriesAsPOne: 0,
                victoriesAsPTwo: 0,
                defeatsAsPOne: 0,
                defeatsAsPTwo: 0,

                // InternalAppInfos
                drawerStatus: false,
                // notifications: [],
                ws_connected: false,
                active_channel: "",
                running_games: [],
                channels_passwords: new Map<string, string>(),
                users_status: new Map<string, UserStatus>(),
            };
        },
        getters: {
            getStatus: (state: MainStoreState) => {
                return (username: string): UserStatus => {
                    return (
                        state.users_status.get(username) || UserStatus.OFFLINE
                    );
                };
            },
            friends(state: MainStoreState) {
                if (state?.followedBy)
                    return intersection(this.followedBy, this.following);
                else return undefined;
            },
            friendRequestSent(state: MainStoreState) {
                // keep only request without follow back
                if (state?.followedBy)
                    return difference(this.following, this.followedBy);
                else return undefined;
            },
            friendRequestRecevied(state: MainStoreState) {
                // keep only request without follow back
                if (state?.followedBy)
                    return difference(this.followedBy, this.following);
                else return undefined;
            },
            getChannelIDByUsername(username: string): string {
                const needle = this.channelSubscriptions.find(
                    (e: ChannelSubscription) =>
                        e.channel.channelType === ChannelType.ONE_TO_ONE &&
                        e.channel.subscribedUsers.some(
                            (u: SubscribedUser) => u.username === username
                        )
                );
                return needle?.channelId;
            },
            oneToOneChannels(state: MainStoreState) {
                const needle = this.channelSubscriptions.find(
                    (e: ChannelSubscription) =>
                        e.channel.channelType === ChannelType.ONE_TO_ONE
                );
                return needle;
            },
            getPublicPrivateChannels(
                state: MainStoreState
            ): Array<ChannelSubscription> | undefined {
                return state.channelSubscriptions?.filter(
                    (e: ChannelSubscription) =>
                        e.channel.channelType !== ChannelType.ONE_TO_ONE
                );
            },
            publicPrivateChannelNamesList(state: MainStoreState) {
                return state.channelSubscriptions?.map(
                    (e: ChannelSubscription) => {
                        if (e.channel.channelType !== ChannelType.ONE_TO_ONE)
                            return e.channel.name;
                    }
                );
            },
        },
        actions: {
            setCurrentChannel(channelId: string) {
                this.active_channel = channelId;
            },
            setStoreData(data: StoreData) {
                this.updateChannelSubscriptions(data.channelSubscriptions);
                delete data.channelSubscriptions;
                this.$patch(data);
            },
            updateChannelSubscriptions(
                channelSubscriptions: ChannelSubscription[]
            ) {
                if (channelSubscriptions.length >= 1) {
                    channelSubscriptions.forEach((e: ChannelSubscription) => {
                        this.updateChannelSubscription(e);
                    });
                }
            },
            updateChannelSubscription(
                channelSubscription: ChannelSubscription
            ) {
                const foundSub: ChannelSubscription | undefined =
                    this.channelSubscriptions.find(
                        (sub: ChannelSubscription) => {
                            return (
                                sub.channelId === channelSubscription.channelId
                            );
                        }
                    );
                if (!foundSub) {
                    channelSubscription.channel.messages?.sort(
                        (a: Message, b: Message) => {
                            // console.log(a.createdAt, b.createdAt);
                            return (
                                a.createdAt?.getTime() - b.createdAt?.getTime()
                            );
                        }
                    );
                    this.channelSubscriptions.push(channelSubscription);
                } else {
                    foundSub.role = channelSubscription.role;
                    foundSub.state = channelSubscription.state;
                    foundSub.stateActiveUntil =
                        channelSubscription.stateActiveUntil;
                    foundSub.channel.subscribedUsers =
                        channelSubscription.channel.subscribedUsers;
                    foundSub.channel.name = channelSubscription.channel.name;
                    foundSub.channel.passwordProtected =
                        channelSubscription.channel.passwordProtected;
                    if (
                        !foundSub.channel.messages &&
                        channelSubscription.channel.messages
                    ) {
                        foundSub.channel.messages =
                            channelSubscription.channel.messages;
                    } else if (
                        foundSub.channel.messages &&
                        channelSubscription.channel.messages &&
                        channelSubscription.channel.messages.length >
                            foundSub.channel.messages.length
                    ) {
                        channelSubscription.channel.messages.sort(
                            (a: Message, b: Message) => {
                                return (
                                    a.createdAt?.getTime() -
                                    b.createdAt?.getTime()
                                );
                            }
                        );
                        for (
                            let i = foundSub.channel.messages.length;
                            i < channelSubscription.channel.messages.length;
                            i++
                        ) {
                            foundSub.channel.messages.push(
                                channelSubscription.channel.messages[i]
                            );
                        }
                    } else if (
                        foundSub.channel.messages &&
                        channelSubscription.channel.messages &&
                        channelSubscription.channel.messages.length <
                            foundSub.channel.messages.length
                    ) {
                        channelSubscription.channel.messages.sort(
                            (a: Message, b: Message) => {
                                return (
                                    a.createdAt.getTime() -
                                    b.createdAt.getTime()
                                );
                            }
                        );
                        for (
                            let i = 0;
                            i < channelSubscription.channel.messages.length;
                            i++
                        ) {
                            foundSub.channel.messages.push(
                                channelSubscription.channel.messages[i]
                            );
                        }
                    }
                }
            },
        },
    }
);

export { useMainStore };
// export const useStore = defineStore("store", {
//   state: () => ({
//     username: "" as String,
//     email: "" as String,
//     channelSubscriptions: [] as Array<models.Subscription>,
//     gameHistoryPOne: [] as Array<models.Game>,
//     gameHistoryPTwo: [] as Array<models.Game>,
//     followedBy: [] as Array<models.Follows>,
//     following: [] as Array<models.Follows>,
//     blocking: [] as Array<models.Blocks>,
//     victoriesAsPOne: 0 as Number,
//     victoriesAsPTwo: 0 as Number,
//     defeatsAsPOne: 0 as Number,
//     defeatsAsPTwo: 0 as Number,
//     // others
//     drawerStatus: false as boolean,
//     vue: null as any,
//   }),

//   getters: {
//     friends(state: any) {
//       if (state?.followedBy)
//         return ld.intersection(this.followedBy, this.following);
//       else return undefined;
//     },
//     friendRequestSent(state: any) {
//       // keep only request without follow back
//       if (state?.followedBy)
//         return ld.difference(this.following, this.followedBy);
//       else return undefined;
//     },
//     friendRequestRecevied(state: any) {
//       // keep only request without follow back
//       if (state?.followedBy)
//         return ld.difference(this.followedBy, this.following);
//       else return undefined;
//     },
//   },

//   actions: {
//     init(vue: any) {
//       this.vue = vue;
//     },
//     async getUser(username: string): Promise<models.User> {
//       return await api.user(username);
//     },

//     async fetch(): Promise<void> {
//       const oldmaps = {
//         followedBy: JSON.parse(JSON.stringify(this.followedBy)),
//         following: JSON.parse(JSON.stringify(this.following)),
//         blocking: JSON.parse(JSON.stringify(this.blocking)),
//       };
//       const isupdate = this.email?.length > 0;

//       try {
//         const me: models.User = await api.me();

//         this.username = me.username;
//         this.email = me.email;
//         this.channelSubscriptions = me.channelSubscriptions;
//         this.gameHistoryPOne = me.gameHistoryPOne;
//         this.gameHistoryPTwo = me.gameHistoryPTwo;
//         this.followedBy = me.followedBy.map(
//           (e: models.Follows) => e.followerId
//         );
//         this.following = me.following.map((e: models.Follows) => e.followingId);
//         this.blocking = me.blocking.map((e: Blocks) => e.blockingId);
//         this.victoriesAsPOne = me.victoriesAsPOne;
//         this.victoriesAsPTwo = me.victoriesAsPTwo;
//         this.defeatsAsPOne = me.defeatsAsPOne;
//         this.defeatsAsPTwo = me.defeatsAsPTwo;

//         if (isupdate) {
//           const diff = {
//             in: {
//               followedBy: ld.difference(this.followedBy, oldmaps.followedBy),
//               following: ld.difference(this.following, oldmaps.following),
//               blocking: ld.difference(this.blocking, oldmaps.blocking),
//             },
//             out: {
//               followedBy: ld.difference(oldmaps.followedBy, this.followedBy),
//               following: ld.difference(oldmaps.following, this.following),
//               blocking: ld.difference(oldmaps.blocking, this.blocking),
//             },
//           };
//           this.notify_diff(diff);
//         }
//       } catch (error) {}
//     },

//     notify_diff(diff: any): void {
//       diff.in.followedBy.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} just follow you !`,
//         });
//       });
//       diff.in.following.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} followed !`,
//         });
//       });
//       diff.in.blocking.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} blocked !`,
//         });
//       });

//       diff.out.followedBy.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} just unfollow you !`,
//         });
//       });
//       diff.out.following.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} unfollowed !`,
//         });
//       });
//       diff.out.blocking.forEach((e: any) => {
//         this.vue.$notifyCenter.send({
//           color: "cyan",
//           avatar: `/api/avatar/${e}/thumbnail`,
//           message: `${e} unblocked !`,
//         });
//       });
//     },
//     getChannelIDByUsername(username: string): string {
//       const needle = this.channelSubscriptions.find(
//         (e: models.Subscription) =>
//           e.channel.channel_type === "ONE_TO_ONE" &&
//           e.channel.SubscribedUsers.some((u) => u.username == username)
//       );
//       return needle?.channelId;
//     },
//     getPublicPrivateChannels(): Array<models.Channel> {
//       return this.channelSubscriptions.filter(
//         (e: models.Subscription) => e.channel.channel_type !== "ONE_TO_ONE"
//       );
//     },
//   },
// });
