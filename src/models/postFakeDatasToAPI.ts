import axios from 'axios'
import { namesList } from './names'
import api from 'src/services/api.service'
import { ISearchQuery } from 'src/services/api.models'
import ld from 'lodash'

function makeid(length: number = 10) {
  var result           = '';
  var characters       = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createUsers(count: number = 0) {
  let i = 0;
  while (i < count) {
    let name: string = namesList[Math.floor(Math.random() * (namesList.length - 1))]
    // const headers = {
    //   "Content-Type": "application/json",
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    //   'Accept': 'application/json',
    // };
    const payload: object = Object({
      username : name,
      password : makeid(21),
      email    : name + "@exemple.com",
    })
    // console.log(payload);

    await axios.post('/api/auth/signup', payload)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })
    i++;
  }
}

export function createMessages(count: number = 0, user: string = '') {
  let users = [] as Array<Object>;

  // getting all users
  let users_tmp = [] as Array<Object>;
  for (let l of 'abcdefghijklmnopqrstuvwxyz') {
    const searchQuery: ISearchQuery = { key: '' }
    api.search(searchQuery)
    .then(function (result) {
      users_tmp.push(...result)
    })
    .catch(function (error) {})
  }
  users = ld.uniqBy(users_tmp, 'username');

  
}
