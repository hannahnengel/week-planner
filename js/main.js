/* global data */
/* exported data */

var $entryForm = document.querySelector('.entry-form');
var $modal = document.querySelector('.modal');
var $greyOverlay = document.querySelector('.grey-overlay');
var $addEntryButton = document.querySelector('.add-entry-button');

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
