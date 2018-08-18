
var button = document.querySelector('#start-button');
var output = document.querySelector('#output');

button.addEventListener('click', function() {
  // Create a new Promise here and use setTimeout inside the function you pass to the constructor

  var promise1 = new Promise((resolve, reject) => {
    setTimeout(function() { // <- Store this INSIDE the Promise you created!
      // Resolve the following URL: https://swapi.co/api/people/1
      resolve('https://swapi.co/api/people/1');
    }, 3000);
  });


  // Handle the Promise "response" (=> the value you resolved) and return a fetch()
  // call to the value (= URL) you resolved (use a GET request)

  promise1.then( function(url){
    console.log('Promise1::Resolved URL = ', url);
    return fetch(url);
  })

  // Handle the response of the fetch() call and extract the JSON data, return that
  // and handle it in yet another then() block
  .then(function(response){
    return response.json();
  })
  // Finally, output the "name" property of the data you got back (e.g. data.name) inside
  // the "output" element (see variables at top of the file)
  .then(function(data){
    console.log('Promise1::JSON data = ', data);
    output.textContent = data.name;
  })
  .catch(function(err){
    console.log('Promise1::Error occurred: ', err);
  })

  // Repeat the exercise with a PUT request you send to https://httpbin.org/put
  // Make sure to set the appropriate headers (as shown in the lecture)
  // Send any data of your choice, make sure to access it correctly when outputting it
  // Example: If you send {person: {name: 'Max', age: 28}}, you access data.json.person.name
  // to output the name (assuming your parsed JSON is stored in "data")

  var promise2 = new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve('https://httpbin.org/put');
    }, 3000);
  });

  promise2.then(function(url){
    console.log('Promise2::Resolved URL = ', url);
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
          name: 'Aara',
          age: 18
      })
    });
  })
  .then(function(response){
    return response.json();
  }
  // Alternative way to handle errors
  /*, function(err){
    console.log('Promise2::Error occurred::caught in then: ', err);
  }*/)
  .then(function(responseJSON){
    //console.log('Promise2::JSON data name = ', JSON.parse(responseJSON.data).name);
    console.log('Promise2::JSON data name = ', responseJSON.json.name);
    output.textContent = responseJSON.json.name;
  })
  // To finish the assignment, add an error to URL and add handle the error both as
  // a second argument to then() as well as via the alternative taught in the module
  .catch(function(err){
    console.log('Promise2::Error occurred::caught in catch: ', err);
  });

});