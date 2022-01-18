var data = {
  entries: [],
  editing: null,
  nextEntryID: 1,
  view: 'Monday'
};

var previousDataJSON = localStorage.getItem('javascript-local-storage');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
});
