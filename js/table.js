import { getUsersFromServer } from './data.js';
import * as modals from './modals.js';
import sortUsers from './sort.js';

const TYPE = {
  new: 'new',
  change: 'change',
};

let users = [];

// Загрузка пользователей
const loading = (body = document.querySelector('.table-body')) => {
  const row = document.createElement('tr');
  const item = document.createElement('td');
  const loader = document.createElement('div');

  row.classList.add('loader');

  item.classList.add('loader__column');
  item.colSpan = 6;

  loader.classList.add('loader__item');

  item.append(loader);
  row.append(item);

  body.append(row);
};

const headerSort = (parent) => {
  const data = {
    id: 'ID',
    fullname: 'Фамилия Имя Отчество',
    createdAt: 'Дата и время создания',
    updatedAt: 'Последние изменения',
    contact: 'Контакты',
    actions: 'Действия',
  };

  let i = 0;

  for (const key of Object.keys(data)) {
    const item = document.createElement('th');

    item.classList.add('table-header__item', `table-header__item_${key}`);

    item.textContent = data[key];

    const countSortRow = 4;

    if (i < countSortRow) {
      item.dataset.filterTop = 1;
      item.classList.add('table-header__sort');

      item.addEventListener('click', async (e) => {
        let filterTop = item.dataset.filterTop;
        const items = document.querySelectorAll('.table-header__sort');

        for (const item of items) {
          item.classList.remove('table-header__sort_active', 'table-header__sort_active-reverse');
          item.dataset.filterTop = 1;   //Показывает в какую сторону сортировать 1: вверх -1:вниз
          item.removeAttribute('data-active');
        };

        e.currentTarget.classList.add(
          filterTop == 1 ? 'table-header__sort_active'
            : 'table-header__sort_active-reverse'
        );

        e.currentTarget.dataset.active = key;

        users = await sortUsers(users, key, filterTop);

        createTableBody({ users });
        item.dataset.filterTop = -filterTop;
      });

      const arrow = document.createElement('span');
      arrow.classList.add('table-header__arrow');

      item.append(arrow);

      if (key === 'fullname') {
        arrow.classList.add('table-header__arrow_FIO');
        arrow.textContent = 'А-Я';
      }
    }
    if (key === 'id') {
      item.classList.add('table-header__sort_active');
      item.dataset.filterTop = -1;
      item.dataset.active = key;
    }
    parent.append(item);
    i++;
  }
};

// header таблицы
export const createHeaderTable = async (table) => {
  const header = document.createElement('thead');
  const row = document.createElement('tr');

  header.classList.add('table__header', 'table-header');

  headerSort(row);
  header.append(row);
  table.append(header);
};

// Создать тело таблицы
export async function createTableBody(tableData = '', table = document.querySelector('.table')) {
  let body;
  if (document.querySelector('.table__body')) {
    body = document.querySelector('.table__body');
    body.textContent = '';
    users = tableData.users;
  } else {
    body = document.createElement('tbody');
    body.classList.add('table__body', 'table-body');
    table.append(body);
  }

  if (!tableData.users) {
    await loading(body);

    document.querySelector('.loader').classList.toggle('loader_active');

    const data = await getUsersFromServer(tableData.filter);
    users = data.users;
    const sortType = document.querySelector('[data-active]').dataset.active;

    sortUsers(users, sortType);

    document.querySelector('.loader').classList.toggle('loader_active');
  }

  for (const user of users) {
    createTableItem(user, body);
  }
}

// Создание строки таблицы
const createTableItem = (user, body) => {
  const addContact = (item) => {
    const contactsType = {
      phone: 'img/phone.svg',
      vk: 'img/vk.svg',
      facebook: 'img/facebook.svg',
      mail: 'img/mail.svg',
      other: 'img/other.svg',
    };
    const contact = document.createElement('img');
    let linkType = '';

    contact.classList.add('contacts__item');

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

    tippy(contact, {
      allowHTML: true,
      content: `${item.type}: <a href=${linkType} target="_blank">${item.value}</a>`,
      interactive: true,
    });
    return contact;
  };

  const createContacts = (contacts, container) => {
    const contactContainer = document.createElement('div');
    const maxContactsShows = 4;

    contactContainer.classList.add('table-row__contacts', 'contacts');

    const count = contacts.length > maxContactsShows ? maxContactsShows : contacts.length;
    for (let i = 0; i < count; i++) {
      contactContainer.append(addContact(contacts[i]));
    }

    if (contacts.length > maxContactsShows) {
      const contact = document.createElement('div');

      contact.classList.add('contacts__item_more');
      contact.textContent = '+' + (contacts.length - maxContactsShows);
      contactContainer.append(contact);
      contact.addEventListener('click', () => {
        contact.remove();
        for (let i = maxContactsShows; i < contacts.length; i++) {
          contactContainer.append(addContact(contacts[i]));
        }
      });
    }
    container.append(contactContainer);
  };

  const getDate = (date) => {
    const getMonth = date.getMonth() + 1;
    const year = date.getFullYear();
    const month = getMonth < 10 ? '0' + getMonth : getMonth;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    const time =
      `${date.getHours() < 10 ? '0' + date.getHours() :
        date.getHours()}:${date.getMinutes() < 10 ?
          '0' + date.getMinutes() : date.getMinutes()}`
    return `${day}.${month}.${year} <span class = 'table-row__time'>${time}</span>`;
  };

  const row = document.createElement('tr');

  const id = document.createElement('td');
  const fullname = document.createElement('td');
  const createDate = document.createElement('td');
  const lastUpdateDate = document.createElement('td');
  const contacts = document.createElement('td');
  const buttons = document.createElement('td');

  const actions = {
    changeButton: document.createElement('button'),
    deleteButton: document.createElement('button'),
  };

  row.classList.add('table-row', 'table-body__row');

  actions.changeButton.classList.add('table-buttons__button', 'table-buttons__button_change');
  actions.deleteButton.classList.add('table-buttons__button', 'table-buttons__button_delete');

  actions.changeButton.textContent = 'Изменить';
  actions.changeButton.addEventListener('click', async () => {
    await modals.mainModal(TYPE.change, user.id);
  });

  actions.deleteButton.textContent = 'Удалить';
  actions.deleteButton.addEventListener('click', async () => {
    modals.deleteUser(user.id);
  });

  id.textContent = user.id;
  id.classList.add('table-row__elem', 'table-row__elem_id');

  fullname.innerHTML =
    `<a class="table-row__elem-link" href="client.html?id=${user.id}">
  ${user.surname} ${user.name} ${user.lastName}
  </a>`;
  fullname.classList.add('table-row__elem', 'table-row__elem_fullname');

  createDate.innerHTML = getDate(new Date(user.createdAt));
  createDate.classList.add('table-row__elem', 'table-row__elem_createDate');

  lastUpdateDate.innerHTML = getDate(new Date(user.updatedAt));
  lastUpdateDate.classList.add('table-row__elem', 'table-row__elem_lastUpdateDate');

  createContacts(user.contacts, contacts);

  contacts.classList.add('table-row__elem', 'table-row__elem_contacts');

  buttons.classList.add('table-row__elem', 'table-buttons');
  buttons.append(actions.changeButton);
  buttons.append(actions.deleteButton);

  row.append(id);
  row.append(fullname);
  row.append(createDate);
  row.append(lastUpdateDate);
  row.append(contacts);
  row.append(buttons);

  body.append(row);
};
