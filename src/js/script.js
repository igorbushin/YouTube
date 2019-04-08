const switcher = document.querySelector('#cbx');
const more = document.querySelector('.more');
const model = document.querySelector('.model');
const videos = document.querySelectorAll('.videos__item');
const data = [
    ['img/thumb_3.webp', 'img/thumb_4.webp', 'img/thumb_5.webp'],
    ['#3 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов',
        '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки  Урок 2',
        '#1 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов'],
    ['3,6 тыс. просмотров', '4,2 тыс. просмотров', '28 тыс. просмотров'],
    ['X9SmcY3lM-U', '7BvHoh0BrMw', 'mC8JW_aG2EM']
];
let player;

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
bindSlideToggle('.hamburger', '[data-slide="nav"]',
    '.header__menu', 'slide-active');

function switchMode() {
    if(night === false) {
        document.body.classList.add('night');
        document.querySelectorAll(
        '.hamburger > line, .videos__item-views, .videos__item-descr'
        ).forEach(item => {
            item.style.color = '#fff';
            item.style.stroke = '#fff';
        });
        document.querySelector('.header__item-descr').style.color = '#fff';
        document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
    }
    else {
        document.body.classList.remove('night');
        document.querySelectorAll( 
        '.hamburger > line, .videos__item-views, .videos__item-descr'
        ).forEach(item => {
            item.style.color = '#000';
            item.style.stroke = '#000';
        });        
        document.querySelector('.header__item-descr').style.color = '#000';
        document.querySelector('.logo > img').src = 'logo/youtube.svg';
    }
    night = !night;
}

let night = false;
switcher.addEventListener('change', () => {
    switchMode();
});

more.addEventListener('click', () => {
    const videosWrapper = document.querySelector('.videos__wrapper');
    more.remove();

    for (let i= 0; i < data[0].length; ++i) {
        let card = document.createElement('a');
        card.classList.add('videos__item','videos__item-active');
        card.setAttribute('date-url', data[3][i]);
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
    }
});