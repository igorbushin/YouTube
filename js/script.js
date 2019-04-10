const switcher = document.querySelector('#cbx');
const modal = document.querySelector('.modal');
const videos = document.querySelectorAll('.videos__item');
const videosWrapper = document.querySelector('.videos__wrapper');

/** Инициализация плеера */
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

/** Логика гамбургера */
function showHeaderMenu(show) {
    const box = document.querySelector('[data-slide="nav"]');
    const boxContent = document.querySelector('.header__menu');
    if (show) {
        box.style.height = boxContent.clientHeight + 'px';
        box.classList.add('slide-active');
    }
    else {
        box.style.height = '0px';
        box.classList.remove('slide-active');
    }
}
function bindSlideToggle(content, openClass) {
    let button = {
        'element': document.querySelector('.hamburger'),
        'active': false
    };
    button.element.addEventListener('click', () => {
        button.active = !button.active;
        showHeaderMenu(button.active);
    });
}
showHeaderMenu(false);
bindSlideToggle();

/** Логика смены темы */
let nightMode = false;
function updateMode() {
    if(nightMode === true) {
        document.body.classList.add('night');
        document.querySelector('.logo > [alt="girl"]').src = 'img/girl-white.png';
        document.querySelector('.logo > [alt="logo"]').src = 'logo/youtube_night.svg';
    }
    else {
        document.body.classList.remove('night');
        document.querySelector('.logo > [alt="girl"]').src = 'img/girl-dark.png';
        document.querySelector('.logo > [alt="logo').src = 'logo/youtube.svg';
    }
    let color = nightMode ? '#fff' : '#000';
    document.querySelectorAll('.hamburger > line').forEach(item => {
        item.style.stroke = color;
    });
    document.querySelectorAll('.videos__item').forEach(item => {
        updateCardMode(item);
    });
    document.querySelector('.header__item-descr').style.color = color;
}
function updateCardMode(card) {
    let color = nightMode ? '#fff' : '#000';
    card.querySelector('.videos__item-descr').style.color = color;
    card.querySelector('.videos__item-chann').style.color = color;
}
switcher.addEventListener('change', () => {
    nightMode = !nightMode;
    updateMode();
});

/** Обрезка названий видео */
let titleLenght = 80;
function sliceTitles(card) {
    card.querySelectorAll('.videos__item-descr, .videos__item-chann').forEach(item => {
        item.textContent = item.textContent.trim();
        if(item.textContent.length > titleLenght) {
            const str = item.textContent.slice(0, titleLenght) + "...";
            item.textContent = str;
        }
    }); 
}

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
function bindNewModal(card) {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const id = card.getAttribute('data-url');
        player.loadVideoById({'videoId' : `${id}`});
        openModal();
    });
}
modal.addEventListener('click', (e) => {
    if(!e.target.classList.contains('modal')) {
        closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if(e.keyCode === 27) {
        closeModal();
    }
});

/**Поиск */
function search(target) {
    gapi.client.init({
        'apiKey': 'AIzaSyBbqfss8ySONlwUYkZNC7parFJuD8drw48',
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"]
    }).then(function() {
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
                <div class="videos__item-chann">
                    ${item.snippet.channelTitle}
                </div>
            `;
            videosWrapper.appendChild(card);
            setTimeout(() => {
                card.classList.remove('videos__item-active');
            }, 10);
            bindNewModal(card);
            updateCardMode(card);   
            sliceTitles(card); 
        });
    }).catch((e) => {
        console.log(e);
    });
}
document.querySelector('.search').addEventListener('submit', (e) => {
    e.preventDefault();
    const target = document.querySelector('.search > input').value;
    document.querySelector('.search > input').value = '';
    gapi.load('client', () => {search(target);});
});
gapi.load('client', () => {search('youtube top');});