var dbPromise = idb.open('posts-db', 2, function (db) {
    if (!db.objectStoreNames.contains('posts-store')) {
        db.createObjectStore('posts-store', { keyPath: 'id' });
    }
});

function writeData(store_name, data) {
    return dbPromise
        .then(function (db) {
            var txn = db.transaction(store_name, 'readwrite');
            var store = txn.objectStore(store_name);
            store.put(data);
            return txn.complete;
        })
}

function readAllData(store_name) {
    return dbPromise
        .then(function (db) {
            var txn = db.transaction(store_name, 'readonly');
            var store = txn.objectStore(store_name);
            return store.getAll();
        });
}

function clearAllData(store_name) {
    return dbPromise
        .then(function (db) {
            var txn = db.transaction(store_name, 'readwrite');
            var store = txn.objectStore(store_name);
            store.clear();
            return txn.complete;
        })
}

// Will be used later
function deleteItemFromStore(store_name, id){
    dbPromise
        .then(function (db) {
            var txn = db.transaction(store_name, 'readwrite');
            var store = txn.objectStore(store_name);
            store.delete(id);
            return txn.complete;
        })
        .then(function () {
            console.log('Item deleted !!');
        })
}