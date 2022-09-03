import { getUsersFromServer } from './data.js';
import { mainModal } from './modals.js';
import * as getTable from './table.js';
import autocomplete from './search.js';

document.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('.wrapper');
  const main = document.querySelector('.main');
  const container = document.createElement('div');

  container.classList.add('container', 'main__container');
  main.classList.add('main');

  // Получить ФИ клиентов для поиска
  const autocompleteSearch = async (parent) => {
    const data = await getUsersFromServer();
    const dataUsers = data.users;
    const usersName = dataUsers.map((x) => x.name);
    const usersSurname = dataUsers.map((y) => y.surname);

    const form = document.createElement('form');
    const inputContainer = document.createElement('div');
    const search = document.createElement('input');

    form.setAttribute('autocomplete', 'off');
    form.classList.add('header__form');
    inputContainer.classList.add('header__input-container', 'autocomplete');

    search.classList.add('header__search');
    search.placeholder = 'Введите запрос';

    let timeout = '';
    search.addEventListener('input', (e) => {
      const value = e.currentTarget.value;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTable.createTableBody({ filter: value });
      }, 300);
    });

    autocomplete(search, usersSurname, usersName);

    inputContainer.append(search);
    form.append(inputContainer);
    parent.append(form);
  };

  // Создать header
  const createHeader = async (parent) => {
    const header = document.querySelector('.header');
    const headerContainer = document.createElement('div');
    const logo = document.createElement('div');

    headerContainer.classList.add('container', 'header__container');
    header.classList.add('header');
    logo.classList.add('header__logo');

    headerContainer.append(logo);
    autocompleteSearch(headerContainer);
    header.append(headerContainer);
    parent.append(header);
  };

  const createTable = () => {
    const tableContainer = document.createElement('div');
    let table;

    if (document.querySelector('.table')) {
      table = document.querySelector('.table');
      table.textContent = '';
    } else {
      table = document.createElement('table');
      table.classList.add('table');
    }

    getTable.createHeaderTable(table);
    getTable.createTableBody('', table);

    tableContainer.append(table);
    tableContainer.classList.add('table-container');
    tableContainer.dataset.simplebar = true;

    container.append(tableContainer);
  };

  const createTitle = () => {
    const title = document.createElement('h1');

    title.classList.add('title', 'main__title');
    title.textContent = 'Клиенты';

    container.append(title);
  };

  const createAddButton = () => {
    const button = document.createElement('button');
    const buttonContainer = document.createElement('div');

    button.textContent = 'Добавить пользователя';
    button.classList.add('main__button');
    button.addEventListener('click', () => {
      mainModal();
    });

    buttonContainer.classList.add('main__button-container');
    buttonContainer.append(button);

    container.append(buttonContainer);
  };

  createHeader(wrapper);
  createTitle(container);
  createTable(container);
  createAddButton(container, wrapper);

  main.append(container);

  wrapper.append(main);
});
