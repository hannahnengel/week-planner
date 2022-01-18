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
var $table = document.querySelector('table');
var $p = document.querySelector('p');

$entryForm.addEventListener('submit', function (event) {
  event.preventDefault();
  var objectOfValues = {
    day: $entryForm.elements.day.value,
    time: $entryForm.elements.time.value,
    description: $entryForm.elements.description.value
  };

  objectOfValues.itemEntryID = data.nextEntryID;
  data.nextEntryID++;
  objectOfValues.nextEntryID = data.nextEntryID;
  data.view = 'Monday';

  data.entries.push(objectOfValues);
  $entryForm.reset();
  hideModal();

  var newEntry = renderEntries(objectOfValues);
  var $trsActive = document.querySelectorAll('tbody > tr.active');

  if ($trsActive.length > 0) {
    var insertBeforeIndex = findInsertBeforeIndex(newEntry);
    $tbody.insertBefore(newEntry, $tbody.childNodes[insertBeforeIndex]);
  } else if ($trsActive.length === 0) {
    $scheduledEventsRow.classList.remove('hidden');
    $scheduledEventsColumn.classList.remove('hidden');
    $weekButtons.classList.remove('invisible');
    if (newEntry.firstChild.getAttribute('data-view') === 'Monday') {
      $p.textContent = '';
      $table.classList.remove('hidden');
    } else {
      $p.textContent = 'No events scheduled for' + ' ' + data.view;
      $table.classList.add('hidden');
    }
    $tbody.prepend(newEntry);
  }
  var $h2 = document.querySelector('h2');
  if (!$h2) {
    $h2 = document.createElement('h2');
    $h2.textContent = 'Scheduled Events for' + ' ' + data.view;
    $scheduledEventsColumn.prepend($h2);
  }
  changeView();
  make8TableLines();
  styleVisibleCells();
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

function sortTimes(dataArray) {
  for (var j = 1; j < dataArray.length; j++) {
    for (var k = 0; k < j; k++) {
      if (dataArray[j].time < dataArray[k].time) {
        var x = dataArray[j];
        dataArray[j] = dataArray[k];
        dataArray[k] = x;
      }
    }
  }
}

function findInsertBeforeIndex(newEntry) {
  var $tds = document.querySelectorAll('td');
  var filteredData = [];
  var allData = [];
  var insertBeforeIndex;
  var newEntryTimeValue = parseInt(newEntry.firstChild.innerHTML);

  for (var i = 0; i < $tds.length; i++) {
    allData.push(parseInt($tds[i].innerHTML));
  }
  for (var j = 0; j < allData.length; j++) {
    if (!isNaN(allData[j])) {
      filteredData.push(parseInt(allData[j]));
    }
  }

  for (var k = 0; k < filteredData.length; k++) {
    if (filteredData.length === 1) {
      if (newEntryTimeValue >= filteredData[k]) {
        insertBeforeIndex = (k + 2);
      } else { insertBeforeIndex = k; }
    } else if (k >= 0 && k < (filteredData.length - 1)) {
      if (newEntryTimeValue >= filteredData[k] && newEntryTimeValue <= filteredData[k + 1]) {
        insertBeforeIndex = (k + 2);
      } else if (newEntryTimeValue <= filteredData[0]) {
        insertBeforeIndex = 1;
      }
    } else if (k === (filteredData.length - 1)) {
      if (newEntryTimeValue >= filteredData[k]) {
        insertBeforeIndex = (k + 2);
      }
    }
  }
  return insertBeforeIndex;
}

function make8TableLines() {
  var $trsActive = document.querySelectorAll('tbody > tr.active');
  var linesToAdd = 8 - $trsActive.length;

  var dayofWeek;
  for (var m = 0; m < $trsActive.length; m++) {
    dayofWeek = $trsActive[m].getAttribute('data-view');
  }

  if ($trsActive.length !== 0 && $trsActive.length < 8) {
    for (var l = 0; l < linesToAdd; l++) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-view', dayofWeek);
      tr.setAttribute('class', 'active');
      var tdTime = document.createElement('td');
      tdTime.setAttribute('data-view', dayofWeek);
      var tdDescription = document.createElement('td');
      tdDescription.setAttribute('data-view', dayofWeek);
      tr.appendChild(tdTime);
      tr.appendChild(tdDescription);

      $tbody.appendChild(tr);
    }
  }
}

function styleVisibleCells() {
  var $trs = document.querySelectorAll('tbody > tr');
  for (var j = 0; j < $trs.length; j++) {
    $trs[j].classList.remove('odd');
  }
  var $trsActive = document.querySelectorAll('tbody > tr.active');
  for (var i = 0; i < $trsActive.length; i++) {
    if ($trsActive[i].className === 'active') {
      if (i % 2 === 0) {
        $trsActive[i].classList.add('odd');
      }
    } else if ($trsActive[i].className === 'hidden') {
      $trsActive[i].classList.remove('odd');
    }
  }

}

function changeView() {
  var $trs = document.querySelectorAll('tbody > tr');
  var $tds = document.querySelectorAll('td');
  var $h2 = document.querySelector('h2');
  $h2.textContent = 'Scheduled Events for' + ' ' + data.view;
  for (var i = 0; i < $trs.length; i++) {
    if ($trs[i].getAttribute('data-view') === data.view) {
      $trs[i].classList.add('active');
      $trs[i].classList.remove('hidden');
    } else {
      $trs[i].classList.add('hidden');
      $trs[i].classList.remove('active');
    }
  }
  for (var j = 0; j < $tds.length; j++) {
    if ($tds[j].getAttribute('data-view') === data.view) {
      $tds[j].classList.add('active');
      $tds[j].classList.remove('hidden');
    } else {
      $tds[j].classList.add('hidden');
      $tds[j].classList.remove('active');
    }
  }
  var $trsActive = document.querySelectorAll('tbody > tr.active');
  if ($trsActive.length > 0) {
    for (var k = 0; k < $trsActive.length; k++) {
      if ($trs[k].className === 'active' && $trs[k].getAttribute('data-view') === data.view) {
        $p.textContent = '';
        $table.classList.remove('hidden');
      }
    }
  } else {
    $p.textContent = 'No events scheduled for' + ' ' + data.view;
    $table.classList.add('hidden');
  }
}

window.addEventListener('DOMContentLoaded', addAnEntry);
function addAnEntry(entry) {
  if (data.entries.length > 0) {
    var dataArray = [];
    for (var i = 0; i < data.entries.length; i++) {
      dataArray.push(data.entries[i]);
    }
    sortTimes(dataArray);
    for (var l = 0; l < dataArray.length; l++) {
      var newEntry = renderEntries(dataArray[l]);
      $tbody.append(newEntry);
    }
    var h2 = document.createElement('h2');
    h2.textContent = 'Scheduled Events for' + ' ' + data.view;
    $scheduledEventsColumn.prepend(h2);
    $weekButtons.classList.remove('invisible');
    $scheduledEventsRow.classList.remove('hidden');
  }
  if (data.entries.length === 0) {
    $weekButtons.classList.add('invisible');
    $scheduledEventsRow.classList.add('hidden');
  }
  data.view = 'Monday';
  changeView();
  make8TableLines();
  styleVisibleCells();
}

function renderEntries(entry) {
  var tr = document.createElement('tr');
  tr.setAttribute('data-view', entry.day);
  var tdTime = document.createElement('td');
  tdTime.setAttribute('data-view', entry.day);
  tdTime.textContent = entry.time;
  var tdDescription = document.createElement('td');
  tdDescription.setAttribute('data-view', entry.day);

  if (entry.day !== 'Monday') {
    tr.setAttribute('class', 'hidden');
    tdTime.setAttribute('class', 'hidden');
    tdDescription.setAttribute('class', 'hidden');
  } else {
    tr.setAttribute('class', 'active');
    tdTime.setAttribute('class', 'active');
    tdDescription.setAttribute('class', 'active');
  }

  tdDescription.textContent = entry.description;
  tr.appendChild(tdTime);
  tr.appendChild(tdDescription);

  return tr;
}

$weekButtons.addEventListener('click', buttonClickViewSwap);
function buttonClickViewSwap(event) {
  if (event.target.className === ('square-button')) {
    var daySpecificData = [];
    var dayofWeek = event.target.getAttribute('data-view');
    data.view = dayofWeek;
    for (var i = 0; i < data.entries.length; i++) {
      if (dayofWeek === data.entries[i].day) {
        daySpecificData.push(data.entries[i]);
      }
    }
    if (daySpecificData.length > 0) {
      sortTimes(daySpecificData);
    }
  }
  changeView();
  make8TableLines();
  styleVisibleCells();
}
