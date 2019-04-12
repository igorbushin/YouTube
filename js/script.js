const switcher = document.querySelector('#switch_checkbox');
const modal = document.querySelector('.modal');
const videosWrapper = document.querySelector('.videos_wrapper');

/** Инициализация плеера */
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('frame', {
      height: '80%',
      width: '80%'
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
let nightMode = true;
function updateMode() {
    if(nightMode === true) {
        document.body.classList.add('night');
    }
    else {
        document.body.classList.remove('night');
    }    
    document.querySelectorAll('.night_img').forEach(item => {
        item.style.display = nightMode ? "inline" : "none";
    });
    document.querySelectorAll('.light_img').forEach(item => {
        item.style.display = nightMode ? "none" : "inline";
    });
    document.querySelectorAll('.videos_item').forEach(item => {
        updateCardMode(item);
    });
}
function updateCardMode(card) {
    let color = nightMode ? '#fff' : '#000';
    card.querySelector('.videos_item-descr').style.color = color;
    card.querySelector('.videos_item-chann').style.color = color;
}
switcher.addEventListener('change', () => {
    nightMode = !nightMode;
    updateMode();
});

/** Обрезка названий видео */
let titleLenght = 80;
function sliceTitles(card) {
    card.querySelectorAll('.videos_item-descr, .videos_item-chann').forEach(item => {
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
    if(!e.target.classList.contains('modal_body')) {
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
            if(item.id.kind != "youtube#video") {
                return;
            }
            let card = document.createElement('a');
            card.classList.add('videos_item');
            card.setAttribute('data-url', item.id.videoId);
            card.innerHTML = `
                <img src="${item.snippet.thumbnails.high.url}" alt="thumb">
                <div class="videos_item-descr">
                    ${item.snippet.title}
                </div>
                <div class="videos_item-chann">
                    ${item.snippet.channelTitle}
                </div>
            `;
            videosWrapper.appendChild(card);
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
    // document.querySelector('.search > input').value = '';
    gapi.load('client', () => {search(target);});
});
gapi.load('client', () => {search('youtube top');});