const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('menu'));
  },
};
function App() {
  this.menu = [];
  const storageLength = store.getLocalStorage() || [];
  this.init = () => {
    if (storageLength.length > 1) {
      this.menu = store.getLocalStorage();
    }
    render();
  };

  const render = () => {
    const template = this.menu
      .map((item, idx) => {
        return `<li data-menu-id="${idx}" class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${item.name}</span>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
  >
    수정
  </button>
  <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
  >
    삭제
  </button>
</li>
          `;
      })
      .join('');

    $('#espresso-menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const createMenuItem = () => {
    if ($('#espresso-menu-name').value === '') {
      alert('메뉴를 입력해주세요.');
      return;
    }
    const espresso_menu_name = $('#espresso-menu-name').value;
    this.menu.push({ name: espresso_menu_name });
    store.setLocalStorage(this.menu);
    render();
    $('#espresso-menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;

    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const changedMenuName = prompt(
      '메뉴 이름을 변경해주세요.',
      $menuName.innerText
    );
    this.menu[menuId].name = changedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = changedMenuName;
  };

  const removeMenuName = (e) => {
    const $menuName = e.target
      .closest('li')
      .querySelector('.menu-name').innerText;
    if (confirm(`"${$menuName}" 삭제하시겠습니까?`)) {
      for (let i = 0; i < this.menu.length; i++) {
        if (this.menu[i].name === $menuName) {
          this.menu.splice(i, 1);
          i--;
        }
      }
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      updateMenuCount();
    }
  };

  $('#espresso-menu-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-edit-button')) {
      updateMenuName(e);
    }
    if (e.target.classList.contains('menu-remove-button')) {
      removeMenuName(e);
    }
  });
  $('#espresso-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  $('#espresso-menu-submit-button').addEventListener('click', createMenuItem);

  $('#espresso-menu-name').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') {
      return;
    }
    createMenuItem();
  });
}

const app = new App();

app.init();
