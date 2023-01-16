<template>
  <div>

    <q-item class="main" v-if="!content || !timestamp">
      <q-item-section class="avatar" @click="profilefun ? profilefun() : null">
        <div v-if="validStatus(onlineStatus)" class="onlineStatus" :class="onlineStatusToCSSClass(onlineStatus)"/>
        <q-img :src="avatar" :width="avatarSize" :height="avatarSize" img-class="usercard-image"/>
      </q-item-section>
      <q-item-section class="datas name-date toto" @click="profilefun ? profilefun() : null">
        <q-item-label class="name">{{ name }}</q-item-label>
      </q-item-section>

      <q-item-section v-if="icon" class="avatar" @click="iconfun ? iconfun() : null">
        <q-avatar :icon="icon" :size="avatarSize"/>
      </q-item-section>
    </q-item>

    <q-item class="main" v-else>
      <q-item-section class="avatar" @click="profilefun ? profilefun() : null">
        <div v-if="validStatus(onlineStatus)" class="onlineStatus" :class="onlineStatusToCSSClass(onlineStatus)"/>
        <q-img :src="avatar" :width="avatarSize" :height="avatarSize" img-class="usercard-image"/>
      </q-item-section>

      <q-item-section class="datas">
        <q-item-section class="name-date">
          <q-item-label class="name" @click="profilefun ? profilefun() : null">{{ name }}</q-item-label>
          <q-item-label class="timestamp" v-if="timestamp">{{ getRelativeDate(timestamp) }}</q-item-label>
        </q-item-section>

        <q-item-section class="content" v-if="content">
          <q-item-label>{{ content }}</q-item-label>
        </q-item-section>
      </q-item-section>

      <q-item-section v-if="icon" class="avatar">
        <q-avatar :icon="icon" :size="avatarSize"/>
      </q-item-section>
    </q-item>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { OnlineStatus } from '../../models/models';

let definedSizes = {
  small : { px: 50  , em: 1 },
  medium: { px: 50  , em: 2 },
  large : { px: 134 , em: 3 },
}


export default defineComponent({
  name: 'UserCard',
  components: { },
  props: {
    name         : { type: String  , required: true    },
    avatar       : { type: String  , required: true    },
    content      : { type: String  , default : null    },
    timestamp    : { type: Date    , default : null    },
    icon         : { type: String  , default : null    },
    size         : { type: String  , default : 'medium' },
    nameColor    : { type: String  , default : 'white'  },
    contentColor : { type: String  , default : 'white'  },
    ratio        : { type: Number  , default : 1        },
    onlineStatus : { type: Number  , default : OnlineStatus.NONE },
    iconfun      : { type: Function, default : undefined },
    profilefun   : { type: Function, default : undefined },
  },
  data() {
    return {

    }
  },
  methods: {
    floorStr(n: number) {
      return (n < 10 ? '0' : '') + n
    },
    getRelativeDate(cdate: Date): string {
      let diff : number = (Date.now() - cdate.getTime()) / (3600)
      if (diff < 24.)
        return 'Today at ' + this.floorStr(cdate.getHours()) + ':' + this.floorStr(cdate.getMinutes())
      else if (diff < 48.)
        return 'Yesterday at ' + this.floorStr(cdate.getHours()) + ':' + this.floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return this.floorStr(d) + '/'
             + this.floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + this.floorStr(cdate.getHours()) + ':'
             + this.floorStr(cdate.getMinutes())
      }
    },
    onlineStatusToCSSClass(s: OnlineStatus) {
      switch (s) {
        case OnlineStatus.ONLINE  : return 'onlineStatus-online'
        case OnlineStatus.OFFLINE : return 'onlineStatus-offline'
        case OnlineStatus.INGAME  : return 'onlineStatus-ingame'
        case OnlineStatus.NONE    : return ''
      }
    },
    validStatus(s: OnlineStatus) { return s != OnlineStatus.NONE }
  },
  computed: {
    marginSize(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * ((definedSizes.small.px / 2)  - definedSizes.small.em  * 8.9)) + 'px');
        case 'medium': return ((this.ratio * ((definedSizes.medium.px / 2) - definedSizes.medium.em * 8.9)) + 'px');
        case 'large' : return ((this.ratio * ((definedSizes.large.px / 2)  - definedSizes.large.em  * 8.9)) + 'px');
        default: return ((this.ratio * ((definedSizes.medium.px / 2) - definedSizes.medium.em * 8.9)) + 'px'); // medium
      }
    },
    avatarSize(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * definedSizes.small.px) + 'px');
        case 'medium': return ((this.ratio * definedSizes.medium.px) + 'px');
        case 'large' : return ((this.ratio * definedSizes.large.px) + 'px');
        default: return ((this.ratio * definedSizes.medium.px) + 'px'); // medium
      }
    },
    textSize(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * definedSizes.small.em) + 'em');
        case 'medium': return ((this.ratio * definedSizes.medium.em) + 'em');
        case 'large' : return ((this.ratio * definedSizes.large.em) + 'em');
        default: return ((this.ratio * definedSizes.medium.em) + 'em'); // medium
      }
    },
    onlineStatusSize(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * definedSizes.small.px  / 2) + 'px');
        case 'medium': return ((this.ratio * definedSizes.medium.px / 2) + 'px');
        case 'large' : return ((this.ratio * definedSizes.large.px  / 3) + 'px');
        default: return ((this.ratio * definedSizes.medium.px / 2) + 'px'); // medium
      }
    },
    onlineStatusPosition(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * definedSizes.small.px  * 0.62) + 'px');
        case 'medium': return ((this.ratio * definedSizes.medium.px * 0.62) + 'px');
        case 'large' : return ((this.ratio * definedSizes.large.px  * 0.62) + 'px');
        default: return ((this.ratio * definedSizes.medium.px * 0.62) + 'px'); // medium
      }
    },
    onlineStatusBorderSize(): string {
      switch (this.size) {
        case 'small' : return ((this.ratio * definedSizes.small.px  * 0.1) + 'px');
        case 'medium': return ((this.ratio * definedSizes.medium.px * 0.1) + 'px');
        case 'large' : return ((this.ratio * definedSizes.large.px  * 0.05) + 'px');
        default: return ((this.ratio * definedSizes.medium.px * 0.1) + 'px'); // medium
      }
    },
  }
});
</script>


<style lang="sass">
.usercard-image
  border-radius: 1000px
  z-index: 2
</style>

<style lang="sass" scoped>
.main
  display: flex-start
  align-items: flex-start
  margin:  0.1em
  padding: 0.1em
  flex-direction: row

.avatar
  max-width: v-bind(avatarSize) !important

.name
  font-weight: bold
  color: v-bind(nameColor)
  font-size: v-bind(textSize)
  margin-right: 0.8vw

  // add '...' to the end of name if it overflow the container
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis

.content
  margin: 0px
  color: v-bind(contentColor)
  font-size: v-bind(textSize)
  word-break: break-word

.timestamp
  margin: 0px

.datas
  margin-left: 0.8vw
  flex-direction: column

.name-date
  flex-direction: row
  justify-content: left
  align-items: flex-start

.toto
  min-height: v-bind(avatarSize) !important
  *
    margin-top: v-bind(marginSize)
    margin-bottom: v-bind(marginSize)

.onlineStatus
  z-index: 1
  width: v-bind(onlineStatusSize)
  height: v-bind(onlineStatusSize)
  background-color: $onlineStatus-online
  border-radius: 50px
  border: v-bind(onlineStatusBorderSize) solid $bg-secondary
  position: absolute !important
  margin-left: v-bind(onlineStatusPosition)
  margin-top:  v-bind(onlineStatusPosition)

.onlineStatus-online
  background-color: $onlineStatus-online
.onlineStatus-offline
  background-color: $onlineStatus-offline
.onlineStatus-ingame
  background-color: $onlineStatus-ingame

</style>
