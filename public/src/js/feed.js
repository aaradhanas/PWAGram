var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
  createPostArea.style.display = 'block';

  if(deferredPrompt){
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then( function(choiceResult){
      console.log('Choice result outcome is', choiceResult.outcome);
      if(choiceResult.outcome === 'dismissed'){
        /* Once the user dismisses the prompt, we cannot show it again. However, the app can be added
            to the home screen using the 'Add to home screen' option */
        console.log('User cancelled installation');
      } else{
        console.log('User accepted installation');
      }
    });

    // Setting it to null since we cannot use it again
    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// Saves the required requests in the cache on user request
function onSaveButtonClicked(event){
  console.log('Button clicked');
  //Check if the browser has support for caches API
  if('caches' in window){
    caches.open('on-user-request')
      .then(function(cache){
        cache.add('https://httpbin.org/get');
        cache.add('/src/images/sf-boat.jpg');
      })
  }
}

function clearCards(){
  while(sharedMomentsArea.hasChildNodes()){
    sharedMomentsArea.removeChild(sharedMomentsArea.lastChild);
  }
}

function createCard(post){
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url('+ post.image+')';
  cardTitle.style.backgroundSize = 'cover';
  cardWrapper.appendChild(cardTitle);

  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'pink';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = post.title;
  cardTitle.appendChild(cardTitleTextElement);

  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = post.location;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);

  /* var cardSaveButton = document.createElement('button');
  cardSaveButton.textContent = 'Save';
  cardSaveButton.addEventListener('click', onSaveButtonClicked);
  cardSupportingText.appendChild(cardSaveButton); */

  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}


function updateUI(posts){
  clearCards();
  for( var i = 0 ; i < posts.length; i++){
    createCard(posts[i]);
  }
}

// Strategy - Cache, then network
var url = 'https://pwa-gram-6c550.firebaseio.com/posts.json';
var networkDataRecieved = false;

fetch(url)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    networkDataRecieved = true;
    console.log('From web : ', data);
    updateUI(getPosts(data));
  });

if('indexedDB' in window){
  readAllData('posts-store')
    .then(function(data){
      if(!networkDataRecieved){
        console.log('From cache : ', data);
        updateUI(data);
      }
    });
}

/* if('caches' in window){
  caches.match(url)
    .then(function(response){
      if(response){
        return response.json();
      }
    })
    .then(function(data){
      console.log('From cache : ', data);
      if(!networkDataRecieved){
       updateUI(getPosts(data));
      }
    })
} */

function getPosts(data){
  var posts = [];
  for(key in data){
    posts.push(data[key]);
  }
  return posts;
}