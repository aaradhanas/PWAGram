var promise = new Promise(function(resolve, reject){
    setTimeout( function() {
        resolve('Hello World');
        //reject({code: 500, message: 'An error occurred!'});
    }, 3000);
});

promise.then(function(text){
    console.log('Chain 1 text = ', text);
    return new Promise(function(resolve, reject){
        resolve(text.toUpperCase());
        //reject({code: 500, message: 'An error occurred!'});
    });
}).then(function(text){
    console.log('Chain 2 text = ', text);
})
// Catch blocks catch any errors occurring in the then blocks that come before it.
.catch(function(err){
    console.log(err.code, err.message);
});
console.log('Executed right after setTimeout');