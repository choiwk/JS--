import { $ } from './utils/dom.js';
import store from './store/store.js';

//? 서버요청 부분
// - [x] 1. 웹 서버를 띄운다
// - [x] 2. 서버에 새로운 메뉴가 추가될 수 있도록 요청한다.
// - [x] 3. 서버에 카테고리별 메뉴리스트를 불러온다.
// - [x] 3. 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [x] 4. 서버에 메뉴의 품절상태가 토글될 수 있도록 요청한다.
// - [x] 5. 서버에 메뉴가 삭제될 수 있도록 요청한다.

//? 리팩토링 부분
// - [x] 1. localStorage에 저장하는 로직은 지운다.
// - [x] 2. fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

//? 사용자 경험
// - [] 1. API 통신이 실패하는 경우에 대해서 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 2. 중복되는 메뉴는 추가할 수 없다.

const BASE_URL = 'http://localhost:3000/api';

const menuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },

  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      alert('에러가 발생했습니다.');
    }
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      alert('메뉴를 수정하는데 실패하였습니다');
    }
    return response.json();
  },

  async soldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: 'PUT',
      }
    );
    if (!response.ok) {
      alert('품절처리를 할 수 없습니다');
    }
  },

  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      alert('메뉴를 삭제할 수 없습니다');
    }
  },
};

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = 'espresso';

  this.init = async () => {
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    const template = this.menu[this.currentCategory]
      .map((item) => {
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name ${item.isSoldOut ? 'sold-out' : ''}">${
          item.name
        }</span>
    <button
    type="button"
    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
  >
    품절
  </button>
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

    $('#menu-list').innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuLeng = this.menu[this.currentCategory].length;
    let soldOutNum = 0;

    for (let i = 0; i < menuLeng; i++) {
      if (this.menu[this.currentCategory][i].isSoldOut) {
        soldOutNum++;
      }
    }
    const menuAmount = menuLeng - soldOutNum;
    $('.menu-count').innerText = `총 ${menuAmount}개`;
  };

  const createMenuItem = async () => {
    if ($('#menu-name').value === '') {
      alert('메뉴를 입력해주세요.');
      return;
    }
    const menu_name = $('#menu-name').value;
    await menuApi.createMenu(this.currentCategory, menu_name);

    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $('#menu-name').value = '';
  };

  const updateMenuName = async (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const menuId = e.target.closest('li').dataset.menuId;
    const changedMenuName = prompt(
      '메뉴 이름을 변경해주세요.',
      $menuName.innerText
    );
    if (changedMenuName == null) {
      return;
    } else {
      await menuApi.updateMenu(this.currentCategory, changedMenuName, menuId);
      this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
        this.currentCategory
      );
      render();
    }
  };

  const removeMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target
      .closest('li')
      .querySelector('.menu-name').innerText;
    if (confirm(`"${$menuName}" 삭제하시겠습니까?`)) {
      // for (let i = 0; i < this.menu[this.currentCategory].length; i++) {
      //   if (this.menu[this.currentCategory][i].name === $menuName) {
      //     this.menu[this.currentCategory].splice(i, 1);
      //     i--;
      //   }
      // }
      await menuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
        this.currentCategory
      );
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;

    await menuApi.soldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
  };

  const initEventListeners = () => {
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
      }
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
    });

    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    $('#menu-submit-button').addEventListener('click', createMenuItem);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      createMenuItem();
    });

    $('nav').addEventListener('click', async (e) => {
      const isCategoryBtn = e.target.classList.contains('cafe-category-name');

      if (isCategoryBtn) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}

const app = new App();

app.init();
