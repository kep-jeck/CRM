import { getUserToIdFromServer } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('.client__wrapper');
  const main = document.querySelector('.client__main');
  const container = document.createElement('div');
  const clientInfo = document.createElement('div');
  const clientPhoto = document.createElement('div');

  container.classList.add('container', 'client__container');
  clientInfo.classList.add('client__info');
  clientPhoto.classList.add('client__photo');
  main.classList.add('main');

  const id = document.location.search.substring(4);
  const user = await getUserToIdFromServer(id);

  const createClientHeader = (parent) => {
    const header = document.querySelector('.client__header');
    const headerContainer = document.createElement('div');
    const logo = document.createElement('div');
    const headerTitle = document.createElement('h2');

    headerContainer.classList.add('container', 'header__container');
    header.classList.add('header');
    logo.classList.add('header__logo');

    headerTitle.classList.add('client__header-title');
    headerTitle.innerText = 'Карточка клиента';

    headerContainer.append(logo);
    headerContainer.append(headerTitle);
    header.append(headerContainer);
    parent.append(header);
  };

  const createClientTitle = () => {
    const titleContainer = document.createElement('div');
    const title = document.createElement('h1');
    const clientID = document.createElement('span');

    titleContainer.classList.add('client__title-container');

    title.classList.add('client__title');
    title.innerHTML = `${user.surname} ${user.name} ${user.lastName}`;

    clientID.classList.add('client__id');
    clientID.innerHTML = `id: ${id}`;

    titleContainer.append(title);
    titleContainer.append(clientID);
    clientInfo.append(titleContainer);
  };

  const getDate = async (date, label, container) => {
    const getMonth = date.getMonth() + 1;
    const year = date.getFullYear();
    const month = getMonth < 10 ? '0' + getMonth : getMonth;
    const day = date.getDate();

    const time =
      `${date.getHours() < 10 ? '0' + date.getHours() :
        date.getHours()}:${date.getMinutes() < 10 ?
          '0' + date.getMinutes() : date.getMinutes()}`;

    const html = document.createElement('span');
    html.classList.add('client__data-date');
    html.innerHTML = `${day}.${month}.${year}г. <span class="client__data-time">${time}</span>`;

    container.append(label);
    container.append(html);
  };

  const getClientDate = async (parent) => {
    const dateCreateContainer = document.createElement('div');
    const dateChangeContainer = document.createElement('div');
    const labelCreate = document.createElement('span');
    const labelChange = document.createElement('span');
    const dateCreate = await new Date(user.createdAt);
    const dateChange = await new Date(user.updatedAt);

    dateCreateContainer.classList.add('client__data-date');
    dateChangeContainer.classList.add('client__data-date');
    labelCreate.classList.add('client__data-label');
    labelChange.classList.add('client__data-label');

    labelCreate.innerText = 'Дата и время создания: ';
    labelChange.innerText = 'Последние изменения: ';

    getDate(dateCreate, labelCreate, dateCreateContainer);
    getDate(dateChange, labelChange, dateChangeContainer);

    parent.append(dateCreateContainer);
    parent.append(dateChangeContainer);
  };

  const createClientIfno = async () => {
    const info = document.createElement('div');

    info.classList.add('client__data');

    getClientDate(info);
    clientInfo.append(info);
  };

  const createClientContact = async (parent) => {
    const contacts = await user.contacts;

    const addContact = (item) => {
      const contactsType = {
        phone: 'img/phone.svg',
        vk: 'img/vk.svg',
        facebook: 'img/facebook.svg',
        mail: 'img/mail.svg',
        other: 'img/other.svg',
      };

      const contactContainer = document.createElement('div');
      const contact = document.createElement('img');
      const contactDescr = document.createElement('span');

      let linkType = '';

      contactContainer.classList.add('client__contacts-container');
      contact.classList.add('client__contacts-item');
      contactDescr.classList.add('client__contacts-descr');

      switch (item.type) {
        case 'Телефон':
          contact.src = contactsType.phone;
          linkType = 'tel:' + item.value;
          break;
        case 'Email':
          contact.src = contactsType.mail;
          linkType = 'mailto:' + item.value;
          break;
        case 'Vk':
          contact.src = contactsType.vk;
          linkType = 'http://' + item.value;
          break;
        case 'Facebook':
          contact.src = contactsType.facebook;
          linkType = 'http://' + item.value;
          break;
        case 'Другое':
          contact.src = contactsType.other;
          linkType = '#';
          break;
        default:
          break;
      }

      contactDescr.innerHTML = `${item.type}: <a href=${linkType} target="_blank">${item.value}</a>`;

      contactContainer.append(contact);
      contactContainer.append(contactDescr);

      return contactContainer;
    };

    const contactsContainer = document.createElement('div');

    contactsContainer.classList.add('client__contacts');

    for (let i = 0; i < contacts.length; i++) {
      contactsContainer.append(addContact(contacts[i]));
    }

    parent.append(contactsContainer);
  };

  const getClientPhoto = (parent) => {
    const clientAvatar = document.createElement('div');
    clientAvatar.classList.add('client__avatar');

    parent.append(clientAvatar);
  };

  const getClientBtn = (parent) => {
    const btnContainer = document.createElement('div');
    const clientBtn = document.createElement('a');

    btnContainer.classList.add('client__btn-container');
    clientBtn.classList.add('client__btn');
    clientBtn.setAttribute('href', 'javascript:history.back()');
    clientBtn.textContent = 'Назад';

    btnContainer.append(clientBtn);
    parent.append(btnContainer);
  };

  createClientHeader(wrapper);

  createClientTitle(clientInfo);
  createClientIfno(clientInfo);
  createClientContact(clientInfo);

  getClientPhoto(clientPhoto);

  container.append(clientInfo);
  container.append(clientPhoto);

  main.append(container);

  getClientBtn(main);

  wrapper.append(main);
});
