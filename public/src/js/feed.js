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

function createCard(){
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);

  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.style.color = 'pink';
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = 'San Francisco Trip';
  cardTitle.appendChild(cardTitleTextElement);

  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = 'In San Francisco';
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);

  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

fetch('https://httpbin.org/get')
.then(function(response){
  return response.json();
})
.then(function(data){
  createCard();
});