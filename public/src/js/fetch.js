fetch('https://httpbin.org/ip')
.then(function(response){
    console.log(response);
   // json is a utility method provided by the fetch API on the body of response object.
   // This is an asynchronous operation since the response body is a readable stream.
   return response.json();
})
.then(function(data){
   console.log(data);
})
.catch(function(err){
    console.log(err);
});

fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // Another mode is 'no-cors'
    mode: 'cors',
    body: JSON.stringify({
        message: 'Does this work?'
    })
})
.then(function(response){
   console.log(response);
   return response.json();
})
.then(function(data){
   console.log(data);
})
.catch(function(err){
    console.log('Error occurred:',err);
});