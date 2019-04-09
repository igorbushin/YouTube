const switcher = document.querySelector('#cbx');
const more = document.querySelector('.more');
const modal = document.querySelector('.modal');
const videos = document.querySelectorAll('.videos__item');
const data = [
    ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
    ['#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
        '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки  Урок 2',
        '#1 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов'],
    ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
    ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM']
];

/** Инициализация YouTube API и плеера */
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('frame', {
      height: '100%',
      width: '100%'
    });
}
function createVideo() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
createVideo();

/** Логика смены темы */
function bindSlideToggle(trigger, boxBody, content, openClass) {
    let button = {
        'element': document.querySelector(trigger),
        'active': false
    };
    const box = document.querySelector(boxBody);
    const boxContent = document.querySelector(content);
    button.element.addEventListener('click', () => {
        if (button.active === false) {
            button.active = true;
            box.style.height = boxContent.clientHeight + 'px';
            box.classList.add(openClass);
        } else {
            button.active = false;
            box.style.height = '0px';
            box.classList.remove(openClass);
        }
    });
}
bindSlideToggle('.hamburger', '[data-slide="nav"]','.header__menu', 'slide-active');
function updateMode() {
    if(nightMode === true) {
        document.body.classList.add('night');
        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    }
    else {
        document.body.classList.remove('night');
        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
    color = nightMode ? '#fff' : '#000';
    document.querySelectorAll('.hamburger > line, .videos__item-views, .videos__item-descr').forEach(item => {
        item.style.color = color;
        item.style.stroke = color;
    });
    document.querySelector('.header__item-descr').style.color = color;
}
let color = null;
let nightMode = false;
switcher.addEventListener('change', () => {
    nightMode = !nightMode;
    updateMode();
});

/** Логика нажатия кнопки "Загрузить еще" */
more.addEventListener('click', () => {
    const videosWrapper = document.querySelector('.videos__wrapper');
    more.remove();

    for (let i= 0; i < data[0].length; ++i) {
        let card = document.createElement('a');
        card.classList.add('videos__item','videos__item-active');
        card.setAttribute('data-url', data[3][i]);
        card.innerHTML = `
            <img src="${data[0][i]}" alt="thumb">
            <div class="videos__item-descr">
                ${data[1][i]}
            </div>
            <div class="videos__item-views">
                ${data[2][i]}
            </div>
        `;
        videosWrapper.appendChild(card);
        setTimeout(() => {
            card.classList.remove('videos__item-active');
        }, 10);
        bindNewModal(card);
    }
    sliceTitle('.videos__item-descr', 100);
    updateMode();
});

/** Обрезка названий видео */
function sliceTitle(titleSelector, count) {
    document.querySelectorAll(titleSelector).forEach(item => {
        item.textContent = item.textContent.trim();
        if(item.textContent.length > count) {
            const str = item.textContent.slice(0, count) + "...";
            item.textContent = str;
        }
    }); 
}
sliceTitle('.videos__item-descr', 100);

/** Проигрование видео в модальном окне */
function openModal() {
    modal.style.display = 'block'; 
}
function closeModal() {
    if(modal.style.display == 'none') {
        return;
    }
    modal.style.display = 'none';
    player.stopVideo();
}
function bindModal(cards) {
    cards.forEach(item => {
        bindNewModal(item);
    });
}
function bindNewModal(card) {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.getAttribute('data-url');
        player.loadVideoById({'videoId' : `${id}`});
        openModal();
    });
}
bindModal(videos);
modal.addEventListener('click', (e) => {
    if(!e.target.classList.contains('modal__body')) {
        closeModal();
    }
});
window.onkeydown = function(e) { 
    if(e.key == 'Escape') {
        closeModal();
    }
};