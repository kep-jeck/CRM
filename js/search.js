import { createTableBody } from './table.js';

export default async function autocomplete(inp, arr1, arr2) {
  let currentFocus;

  inp.addEventListener('input', function () {
    let autocompleteItem,
      i = this.value;
    const val = this.value;

    if (!val) { return false; }

    closeAllLists();

    currentFocus = -1;
    const autocompleteList = document.createElement('div');
    autocompleteList.setAttribute('id', this.id + 'autocomplete-list');
    autocompleteList.classList.add('header__search-list', 'autocomplete-items');
    this.parentNode.appendChild(autocompleteList);

    function getSearch(arr) {
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
          autocompleteItem = document.createElement('div');
          autocompleteItem.classList.add('header__search-item', 'autocomplete-item');

          autocompleteItem.innerHTML = '<span class = "mark">' + arr[i].substr(0, val.length) + '</span>';
          autocompleteItem.innerHTML += arr[i].substr(val.length);
          autocompleteItem.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";

          autocompleteItem.addEventListener('click', function () {
            inp.value = this.getElementsByTagName('input')[0].value;
            closeAllLists();
            createTableBody({ filter: inp.value });
          });
          autocompleteList.appendChild(autocompleteItem);
        }
      }
    }

    getSearch(arr1);
    getSearch(arr2);
  });

  inp.addEventListener('keydown', function (e) {
    let x = document.getElementById(this.id + 'autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add('autocomplete-active');
  };

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete-active');
    }
  };

  function closeAllLists(elmnt) {
    const x = document.getElementsByClassName('autocomplete-items');
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener('click', (e) => {
    closeAllLists(e.target);
  });
}
