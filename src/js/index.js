const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem('menu', JSON.stringify(menu));
  },
  getLocalStorage(menu) {
    localStorage.getItem('menu');
  },
};
function App() {
  const menu = [];
  console.log(menu);

  const updateMenuCount = () => {
    const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  };

  const createMenuItem = () => {
    if ($('#espresso-menu-name').value === '') {
      alert('메뉴를 입력해주세요.');
      return;
    }
    let espresso_menu_name = $('#espresso-menu-name').value;
    menu.push({ name: espresso_menu_name });
    store.setLocalStorage(menu);
    const template = menu
      .map((item) => {
        return `<li class="menu-list-item d-flex items-center py-2">
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
    espresso_menu_name = $('#espresso-menu-name').value = '';
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const changedMenu = prompt(
      '메뉴 이름을 변경해주세요.',
      $menuName.innerText
    );
    $menuName.innerText = changedMenu;
  };

  const removeMenuName = (e) => {
    const $menuName = e.target
      .closest('li')
      .querySelector('.menu-name').innerText;
    if (confirm(`"${$menuName}" 삭제하시겠습니까?`)) {
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

App();
