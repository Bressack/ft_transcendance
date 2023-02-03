import { namesList } from './names'
import api from '../src/services/api.service'

export class Bot {
  username = '' as string
  email = '' as string
  password = '' as string

  constructor(username: string, email: string, password: string) {
    this.username = username
    this.email = email
    this.password = password
  }

  async signup() : Promise<Object> {
    let payload: object = Object({
      username: this.username,
      email: this.email,
      password: this.password,
    })
    return await api.signup(payload)
  }

  async signin() {}

  async try_to_login() {
    await this.signup()
    .then(() => {})
    .catch(async () => {
      await this.signin()
      .then(() => {})
      .catch(() => {})
    })
  }
}
