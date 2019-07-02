export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD8Mz3JgASt9sLOpqwW-WVd1FoMKv8ceCE",
  authDomain: "arobaraotrolado.firebaseapp.com",
  databaseURL: "https://arobaraotrolado.firebaseio.com",
  projectId: "arobaraotrolado",
  storageBucket: "arobaraotrolado.appspot.com",
  messagingSenderId: "108433864502"
};

export const snapshotToArray = snapshot => {
  let returnArray = [];
  snapshot.forEach(element => {
    let item = element.val();
    item.key = element.key;
    returnArray.push(item);
  });

  return returnArray;
}