import { randFloat } from "three/src/math/MathUtils"
import { reactive, ref, Ref} from 'vue';

export type NotifyOptions = {
  type? : string | null
  color? : string | null
  message : string | null
  avatar? : string | null
}

interface INotifications {
  id : number
  createdAt: Date;
  options: NotifyOptions;
}

export class Notifications implements INotifications {

  id: number
  createdAt: Date;
  options: NotifyOptions;

  constructor(options: NotifyOptions) {
    this.id = randFloat(0, 1)
    this.createdAt = new Date()
    this.options = reactive<NotifyOptions>(options)
  }

}

export class NotifyCenter {

  public notifications = reactive<Map<number, Notifications>>(new Map<number, Notifications>());
  public quasar: any


  push(options: NotifyOptions) {
    const n = new Notifications(options)
    this.notifications.set(n.id, n)
  }

  pop(id: number) {
    this.notifications.delete(id)
  }

  clear() {
    this.notifications.clear()
  }

  getAll() : IterableIterator<Notifications> {
    return this.notifications.values()
  }

  send(options: NotifyOptions) {
    this.quasar.notify(options)
    this.push(options)
    console.log(this.notifications);
  }

  init(quasar: any) {
    this.quasar = quasar
  }

}

const nc = new NotifyCenter()

export default nc
