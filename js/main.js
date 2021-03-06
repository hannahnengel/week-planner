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

  if (data.editing !== null) {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].itemEntryID === data.editing.itemEntryID) {
        objectOfValues.itemEntryID = data.entries[i].itemEntryID;
        objectOfValues.nextEntryID = data.entries[i].nextEntryID;
        var itemEntryID = data.editing.itemEntryID;
        data.entries.splice(i, 1);
        var $oldData = document.querySelector('[data-entry-id =' + CSS.escape(itemEntryID) + ']');
        $tbody.removeChild($oldData);
        data.editing = null;
        resetModal();
      }
    }
  } else {
    objectOfValues.itemEntryID = data.nextEntryID;
    data.nextEntryID++;
    objectOfValues.nextEntryID = data.nextEntryID;
  }
  data.view = 'Monday';

  data.entries.push(objectOfValues);
  $entryForm.reset();
  hideModal();

  var newEntry = renderEntries(objectOfValues);
  var $trsActive = document.querySelectorAll('tbody > tr.active');

  if ($trsActive.length > 0) {
    $tbody.prepend(newEntry);
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
  showNumberOfEntries();
});

$addEntryButton.addEventListener('click', function (event) {
  resetModal();
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

      var tdButtons = document.createElement('td');
      tdButtons.setAttribute('data-view', dayofWeek);
      tdButtons.setAttribute('class', 'text-align-end');
      var updateButton = document.createElement('button');
      updateButton.setAttribute('class', 'invisible rectangle update-button');
      updateButton.textContent = 'Update';
      tdButtons.appendChild(updateButton);

      tr.appendChild(tdTime);
      tr.appendChild(tdDescription);
      tr.appendChild(tdButtons);

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
  var $h2 = document.querySelector('div.scheduled-events-column > h2');
  if ($h2 !== null) { $h2.textContent = 'Scheduled Events for' + ' ' + data.view; }
  if ($trs.length > 0) {
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
        if ($trsActive[k].getAttribute('data-view') === data.view) {
          $p.textContent = '';
          $table.classList.remove('hidden');
        }
      }
    } else if ($trsActive.length === 0) {
      $p.textContent = 'No events scheduled for' + ' ' + data.view;
      $table.classList.add('hidden');
    }
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
  showNumberOfEntries();
}

function renderEntries(entry) {
  var tr = document.createElement('tr');
  tr.setAttribute('data-view', entry.day);
  tr.setAttribute('data-entry-id', entry.itemEntryID);
  var tdTime = document.createElement('td');
  tdTime.setAttribute('data-view', entry.day);
  tdTime.textContent = entry.time;
  var tdDescription = document.createElement('td');
  tdDescription.setAttribute('data-view', entry.day);

  var tdButtons = document.createElement('td');
  tdButtons.setAttribute('data-view', entry.day);
  var updateButton = document.createElement('button');
  updateButton.setAttribute('class', 'rectangle update-button');
  updateButton.textContent = 'Update';
  var deleteButton = document.createElement('button');
  deleteButton.setAttribute('class', 'rectangle delete-button');
  deleteButton.textContent = 'Delete';
  tdButtons.appendChild(updateButton);
  tdButtons.appendChild(deleteButton);

  if (entry.day !== 'Monday') {
    tr.setAttribute('class', 'hidden');
    tdTime.setAttribute('class', 'hidden');
    tdDescription.setAttribute('class', 'hidden');
    tdButtons.setAttribute('class', 'hidden text-align-end');
  } else {
    tr.setAttribute('class', 'active');
    tdTime.setAttribute('class', 'active');
    tdDescription.setAttribute('class', 'active');
    tdButtons.setAttribute('class', 'active text-align-end');
  }

  tdDescription.textContent = entry.description;
  tr.appendChild(tdTime);
  tr.appendChild(tdDescription);
  tr.appendChild(tdButtons);

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
  showNumberOfEntries();
}

var trEditing;
$table.addEventListener('click', editAnEntry);
function editAnEntry(event) {
  trEditing = event.target.closest('tr');
  var dayOfWeek = event.target.closest('tr').getAttribute('data-view');
  var tdTime = event.target.closest('tr').childNodes[0].innerHTML;
  var tdDescription = event.target.closest('tr').childNodes[1].innerHTML;

  for (var i = 0; i < data.entries.length; i++) {
    if (data.entries[i].day === dayOfWeek && data.entries[i].time === tdTime && data.entries[i].description === tdDescription) {
      data.editing = data.entries[i];
    }
  }
  if (event.target.className === 'rectangle update-button') {
    resetModal();
    openModal();
    var $h1 = document.querySelector('div.modal > div.row > div.column-full > h1');
    $h1.textContent = 'Update Entry';

    var $formDescription = $entryForm.querySelector('textarea');
    $formDescription.textContent = tdDescription;

    var $formOptions = $entryForm.querySelectorAll('option');
    for (var j = 0; j < $formOptions.length; j++) {
      if ($formOptions[j].innerHTML === dayOfWeek || $formOptions[j].innerHTML === tdTime) {
        $formOptions[j].setAttribute('selected', 'selected');
      }
    }

  } else if (event.target.className === 'rectangle delete-button') {
    resetModal();
    openModal();
    $h1 = document.querySelector('div.modal > div.row > div.column-full > h1');
    $h1.textContent = 'Delete Entry';
    $entryForm.classList.add('hidden');
    var $h2 = $modal.querySelector('h2');
    if ($h2 === null) {
      $modal.appendChild(createDeleteModal());
    }
    var $deleteModal = document.querySelector('.delete-modal');
    $deleteModal.classList.remove('hidden');
  }
  changeView();
  styleVisibleCells();

}

function createDeleteModal() {
  var divDeleteModal = document.createElement('div');
  divDeleteModal.setAttribute('class', 'delete-modal');

  var divRow1 = document.createElement('div');
  divRow1.setAttribute('class', 'row');
  var divColumnFull1 = document.createElement('div');
  divColumnFull1.setAttribute('class', 'column-full');
  var h2 = document.createElement('h2');
  h2.textContent = 'Are you sure you want to delete this entry?';
  divColumnFull1.appendChild(h2);
  divRow1.appendChild(divColumnFull1);

  var divRow2 = document.createElement('div');
  divRow2.setAttribute('class', 'row');
  var divColumnFull2 = document.createElement('div');
  divColumnFull2.setAttribute('class', 'column-full');
  var yesButton = document.createElement('button');
  yesButton.setAttribute('class', 'rectangle yes-button');
  yesButton.textContent = 'Yes';
  var noButton = document.createElement('button');
  noButton.setAttribute('class', 'rectangle no-button');
  noButton.textContent = 'No';
  divColumnFull2.appendChild(yesButton);
  divColumnFull2.appendChild(noButton);
  divRow2.appendChild(divColumnFull2);

  divDeleteModal.appendChild(divRow1);
  divDeleteModal.appendChild(divRow2);

  return divDeleteModal;
}

$modal.addEventListener('click', deleteAnEntry);
function deleteAnEntry(event) {
  if (event.target.className === 'rectangle no-button') {
    hideModal();
  } else if (event.target.className === 'rectangle yes-button') {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].itemEntryID === parseInt(trEditing.getAttribute('data-entry-id'))) {
        $tbody.removeChild(trEditing);
        data.entries.splice(i, 1);
      }
    }
    data.editing = null;
    hideModal();
    make8TableLines();
    changeView();
    styleVisibleCells();
    showNumberOfEntries();
  }
}

function resetModal() {
  $entryForm.reset();
  var $h1Modal = document.querySelector('div.modal > div.row > div.column-full > h1');
  $h1Modal.textContent = 'Add Entry';
  $entryForm.classList.remove('hidden');

  var $formOptions = document.querySelectorAll('option');
  for (var i = 0; i < $formOptions.length; i++) {
    $formOptions[i].removeAttribute('selected');
  }

  var $textArea = document.querySelector('textarea');
  $textArea.textContent = '';

  var $deleteModal = document.querySelector('.delete-modal');
  if ($deleteModal !== null) {
    $deleteModal.classList.add('hidden');
  }
}

function showNumberOfEntries() {
  var $weekButtonList = document.querySelectorAll('button.square-button');
  var $spanList = document.querySelectorAll('span');

  for (var o = 0; o < $spanList.length; o++) {

    if ($weekButtonList[o].getAttribute('data-view') === $spanList[o].getAttribute('data-view')) {
      var numberOfEntries = 0;
      var dayOfWeek = $spanList[o].getAttribute('data-view');

      var $trs = document.querySelectorAll('tbody > tr[data-view="' + dayOfWeek + '"]');

      var $tds = document.querySelectorAll('tbody > tr > td[data-view="' + dayOfWeek + '"]');
      var doubled = 0;
      var rowsToDelete = 0;
      if ($tds.length > 0) {
        for (var p = 0; p < $tds.length; p++) {
          if ($tds[p].innerHTML === '') {
            doubled += 1;
            rowsToDelete = (doubled / 2);
          }
        }
      } else rowsToDelete = 0;
      numberOfEntries = $trs.length - rowsToDelete;
      $spanList[o].innerHTML = numberOfEntries;
    }
  }
}
