// Import stylesheets
import './style.css';

import { BaseStorage, ClientFactory } from '@worldsibu/convector-core';
import { BrowserControllerAdapter, LocalstorageStorage } from '@worldsibu/convector-platform-browser';

import { User } from './mecservice.model';
import { UserController } from './mecservice.controller';

const appDiv: HTMLElement = document.getElementById('app');

const log = (...msg) => {
  console.log(...msg);
  appDiv.innerHTML +=
    `<br>${msg.map(m => typeof m === 'string' ? m : JSON.stringify(m)).join(' ')}`;
}

BaseStorage.current = new LocalstorageStorage();

log('Creating adapter');
const adapter = new BrowserControllerAdapter();
adapter.init([
  UserController
]);

log('Creating client');
const client = ClientFactory(UserController, adapter);

const users = [
  {
    name: 'Diego',
    identity: '8b2d005f-ba35-44ab-83bb-f20426afee19'
  },{
    name: 'Walter',
    identity: '0c214b75-15ec-4bbc-8752-0a48ad26bf18'
  },{
    name: 'Uriel',
    identity: '6e5be864-d140-4a95-98c0-d15b94b7391f'
  },{
    name: 'Richard',
    identity: '5b48d13b-9669-4ab3-b816-bc032c645b7e'
  }
];

async function registerUsers() {
  log('Registering users');
  await Promise.all(users.map(async (user, id) => {
    await client.$withUser(user.identity).registerUser(user.name)
      .catch(e => {if (!e.message.startsWith('DUPERR')) throw e});
  }));

  log('Users registered');
  log(await User.getAll());
}

async function chargeUser() {
  log('Charge users');
  await Promise.all(users.map(async (user, id) => {
    await client.$withUser(user.identity).userCharge(10)
      .catch(e => {if (!e.message.startsWith('DUPERR')) throw e});
  }));

  log('Users registered');
  log(await User.getAll());
}

registerUsers()
  .then(() => {
  	chargeUser().then(()=>{
  		
  	}).catch(e => log('Error', e.message));
  })
  .catch(e => log('Error', e.message));