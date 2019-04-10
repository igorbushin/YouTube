const switcher = document.querySelector('#cbx');
const more = document.querySelector('.more');
const modal = document.querySelector('.modal');
const videos = document.querySelectorAll('.videos__item');
const videosWrapper = document.querySelector('.videos__wrapper');

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
function updateCardMode(card) {
    card.querySelectorAll('.videos__item-views, .videos__item-descr').forEach(item => {
        item.style.color = color;
    });
}
let color = null;
let nightMode = false;
switcher.addEventListener('change', () => {
    nightMode = !nightMode;
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
document.addEventListener('keydown', (e) => {
    if(e.keyCode === 27) {
        closeModal();
    }
});

/** Логика нажатия кнопки "Загрузить еще" */
function load() {
    gapi.client.init({
        'apiKey': 'AIzaSyBbqfss8ySONlwUYkZNC7parFJuD8drw48',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
        return gapi.client.youtube.playlistItems.list({
            "part": "snippet, contentDetails",
            "maxResults" : '12',
            "playlistId" : 'PLVfMKQXDAhGW12JY3SfeDnEx7S5_tn11j'
        });
    }).then(function(response) {
        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.classList.add('videos__item','videos__item-active');
            card.setAttribute('data-url', item.contentDetails.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    x просмотров
                </div>
            `;//${data[2][i]}
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 10);
            bindNewModal(card);
            updateCardMode(card);    
        });
        sliceTitle('.videos__item-descr', 100);

    }).catch((e) => {
        console.log(e);
    });
}
more.addEventListener('click', () => {
    more.remove();
    gapi.load('client', load);
});

/**Поиск */
function search(target) {
    gapi.client.init({
        'apiKey': 'AIzaSyBbqfss8ySONlwUYkZNC7parFJuD8drw48',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
        const target = document.querySelector('.search > input').value;
        document.querySelector('.search > input').value = '';
        return gapi.client.youtube.search.list({
            'maxResults' : '12',
            'part' : 'snippet',
            'q' : `${target}`,
            'type' : ''
        });
    }).then(function(response) {
        videosWrapper.innerHTML = '';
        response.result.items.forEach(item => {
            let card = document.createElement('a');
            card.classList.add('videos__item','videos__item-active');
            card.setAttribute('data-url', item.id.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos__item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos__item-views">
                    x просмотров
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 10);
            bindNewModal(card);
            updateCardMode(card);    
        });
        sliceTitle('.videos__item-descr', 100);
    }).catch((e) => {
        console.log(e);
    });
}
document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    gapi.load('client', search);
});