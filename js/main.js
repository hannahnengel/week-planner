/* global data */
/* exported data */

var $entryForm = document.querySelector('.entry-form');
var $modal = document.querySelector('.modal');
var $greyOverlay = document.querySelector('.grey-overlay');
var $addEntryButton = document.querySelector('.add-entry-button');
var $scheduledEventsRow = document.querySelector('.scheduled-events-row');
var $scheduledEventsColumn = document.querySelector('.scheduled-events-column');
var $weekButtons = document.querySelector('.week-buttons');
var $tbody = document.querySelector('tbody');

$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var objectOfValues = {
    day: $entryForm.elements.day.value,
    time: $entryForm.elements.time.value,
    description: $entryForm.elements.description.value
  };
  data.push(objectOfValues);
  $entryForm.reset();
  hideModal();

  var newEntry = renderEntries(objectOfValues);
  var $tds = document.querySelectorAll('td');
  // will need to add if statement for other days of the week //
  var filteredData = [];
  var allData = [];
  for (var i = 0; i < $tds.length; i++) {
    allData.push(parseInt($tds[i].innerHTML));
  }
  for (var j = 0; j < allData.length; j += 2) {
    filteredData.push(parseInt(allData[j]));
  }
  var insertBeforeIndex;
  for (var k = 0; k < filteredData.length; k++) {
    if (parseInt(newEntry.firstChild.innerHTML) >= filteredData[k] && parseInt(newEntry.firstChild.innerHTML) <= filteredData[k + 1]) {
      insertBeforeIndex = (k + 2);
    }
  }
  $tbody.insertBefore(newEntry, $tbody.childNodes[insertBeforeIndex]);
});

$addEntryButton.addEventListener('click', function (event) {
  openModal();
});

function hideModal() {
  $modal.classList.add('hidden');
  $greyOverlay.classList.add('hidden');
}

function openModal() {
  $modal.classList.remove('hidden');
  $greyOverlay.classList.remove('hidden');
}

window.addEventListener('DOMContentLoaded', addAnEntry);
function addAnEntry(entry) {
  var entryDay;
  if (data.length > 0) {
    var dataArray = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].day === 'Monday') {
        dataArray.push(data[i]);
      }
    }
    sortTimes(dataArray);
    for (var l = 0; l < dataArray.length; l++) {
      var newEntry = renderEntries(dataArray[l]);
      $tbody.append(newEntry);
      entryDay = dataArray[l].day;
    }
    var h2 = document.createElement('h2');
    h2.textContent = 'Scheduled Events for' + ' ' + entryDay;
    $scheduledEventsColumn.prepend(h2);
    $weekButtons.classList.remove('invisible');
    $scheduledEventsRow.classList.remove('hidden');
  }

  if (data.length === 0) {
    $weekButtons.classList.add('invisible');
    $scheduledEventsRow.classList.add('hidden');
  }
}

function sortTimes(entry) {
  for (var j = 1; j < entry.length; j++) {
    for (var k = 0; k < j; k++) {
      if (entry[j].time < entry[k].time) {
        var x = entry[j];
        entry[j] = entry[k];
        entry[k] = x;
      }
    }
  }
}

function renderEntries(entry) {

  var tr = document.createElement('tr');
  var tdTime = document.createElement('td');
  tdTime.textContent = entry.time;
  var tdDescription = document.createElement('td');
  tdDescription.textContent = entry.description;
  tr.appendChild(tdTime);
  tr.appendChild(tdDescription);

  return tr;
}
