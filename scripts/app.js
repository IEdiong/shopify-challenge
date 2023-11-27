'use strict';

const MARKED_AS_DONE = 'marked-as-done';

// Get elements from the DOM
const menuBtn = document.getElementById('menubutton');
const menu = document.getElementById('menu-content');
const menuItems = menu.querySelectorAll('[role="menuitem"]');

const notificationBtn = document.getElementById('notification-btn');
const notification = document.getElementById('notification-panel');

const trailCloseBtn = document.getElementById('trialclosebtn');
const trailCallout = document.getElementById('trial-callout');

const stepsToggleBtn = document.getElementById('steps-toggle-btn');
const stepsList = document.getElementById('steps-list');

const checkboxButton = document.getElementById('shopping-item-checkbox');
const notCompletedIcon = document.getElementById('not-completed-icon');
const completedIcon = document.getElementById('completed-icon');
const loadingSpinnerIcon = document.getElementById('loading-spinner-icon');

let escapeListner,
  menuNavigation,
  el = 0;

// Add event listeners
menuBtn.addEventListener('click', toggleMenu);
notificationBtn.addEventListener('click', toggleNotification);
trailCloseBtn.addEventListener('click', closeCallout);
stepsToggleBtn.addEventListener('click', toggleStepsToggle);
checkboxButton.addEventListener('click', handleMardDoneOrNotDone);

// Function to execute
function toggleMenu() {
  // change the aria-* attribute
  // Focus on first menu item or button
  if (menuBtn.attributes['aria-expanded'].value === 'true') {
    closeMenu();
  } else {
    openMenu();
  }
}

function closeMenu() {
  menu.classList.toggle('menu-open');
  menuBtn.ariaExpanded = 'false';
  menuBtn.focus();

  menu.removeEventListener('keyup', escapeListner);
  menu.removeEventListener('keyup', menuNavigation);
}

function openMenu() {
  el = 0;
  menu.classList.toggle('menu-open');
  menuBtn.ariaExpanded = 'true';
  menuItems.item(el).focus();

  escapeListner = menu.addEventListener('keyup', handleMenuEscapeKeypress);
  menuNavigation = menu.addEventListener('keyup', handleMenuNavigation);
}

function handleMenuEscapeKeypress(e) {
  if (e.keyCode === 27) closeMenu();
}

function handleMenuNavigation(e) {
  // console.log(e);

  // 40 -> down arrow
  // 39 -> right arrow
  // 37 -> left arrow
  // 38 -> up arrow

  if (e.keyCode === 40 || e.keyCode === 39) {
    if (el < menuItems.length - 1) {
      el++;
    } else {
      el = 0;
    }
  } else {
    if (el > 0) {
      el--;
    } else {
      el = menuItems.length - 1;
    }
  }
  menuItems.item(el).focus();
}

function openNotification() {
  notification.classList.add('open-notification');
  notificationBtn.ariaExpanded = 'true';
}

function closeNotification() {
  notification.classList.remove('open-notification');
  notificationBtn.ariaExpanded = 'false';
}

function toggleNotification() {
  if (notificationBtn.attributes['aria-expanded'].value === 'true') {
    closeNotification();
  } else {
    openNotification();
  }
}

function closeCallout() {
  trailCallout.classList.add('hide-banner');
}

function toggleStepsToggle() {
  stepsList.classList.toggle('hidden');
  stepsToggleBtn.classList.toggle('toggle-open');
}

function handleMardDoneOrNotDone() {
  const markedAsDone = checkboxButton.classList.contains(MARKED_AS_DONE);

  if (markedAsDone) {
    markAsNotDone();
  } else {
    markAsDone();
  }
}

function markAsDone() {
  notCompletedIcon.classList.add('icon-hidden');
  loadingSpinnerIcon.classList.remove('icon-hidden');

  setTimeout(() => {
    loadingSpinnerIcon.classList.add('icon-hidden');
    completedIcon.classList.remove('icon-hidden');

    checkboxButton.classList.add(MARKED_AS_DONE);
  }, 2000);
}

function markAsNotDone() {
  completedIcon.classList.add('icon-hidden');
  loadingSpinnerIcon.classList.remove('icon-hidden');

  setTimeout(() => {
    loadingSpinnerIcon.classList.add('icon-hidden');
    notCompletedIcon.classList.remove('icon-hidden');

    checkboxButton.classList.remove(MARKED_AS_DONE);
  }, 2000);
}
