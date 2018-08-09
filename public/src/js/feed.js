var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

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
