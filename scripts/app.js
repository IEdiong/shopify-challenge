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

const allStepTriggers = document.querySelectorAll('.step__status');
const stepsAnnouncer = document.getElementById('steps-live');

let escapeListner,
  menuNavigation,
  el = 0;

// Add event listeners
menuBtn.addEventListener('click', toggleMenu);
notificationBtn.addEventListener('click', toggleNotification);
trailCloseBtn.addEventListener('click', closeCallout);
stepsToggleBtn.addEventListener('click', toggleStepsToggle);

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

// ! Close Callout
function closeCallout() {
  trailCallout.classList.add('hide-banner');
}

// ! Toggle Accordion Card
function toggleStepsToggle() {
  stepsList.classList.toggle('hidden');
  stepsToggleBtn.classList.toggle('toggle-open');
}

// ! Mark as done
function handleMardDoneOrNotDone() {
  // console.log(this.children);
  const markedAsDone = this.classList.contains(MARKED_AS_DONE);

  if (markedAsDone) {
    markAsNotDone(this);
  } else {
    markAsDone(this);
  }
}

function markAsDone(ctx) {
  ctx.children.item(0).classList.add('icon-hidden');
  ctx.children.item(2).classList.remove('icon-hidden');

  stepsAnnouncer.ariaLabel = 'Loading. Please wait...';

  setTimeout(() => {
    ctx.children.item(2).classList.add('icon-hidden');
    ctx.children.item(1).classList.remove('icon-hidden');

    ctx.classList.add(MARKED_AS_DONE);
    stepsAnnouncer.ariaLabel = `Successfully marked ${ctx.ariaLabel
      .split(' ')
      .splice(1)
      .join(' ')}`;
    ctx.ariaLabel = ctx.ariaLabel.replace('done', 'not done');
  }, 2000);
}

function markAsNotDone(ctx) {
  ctx.children.item(1).classList.add('icon-hidden');
  ctx.children.item(2).classList.remove('icon-hidden');

  stepsAnnouncer.ariaLabel = 'Loading. Please wait...';

  setTimeout(() => {
    ctx.children.item(2).classList.add('icon-hidden');
    ctx.children.item(0).classList.remove('icon-hidden');

    ctx.classList.remove(MARKED_AS_DONE);
    stepsAnnouncer.ariaLabel = `Successfully marked ${ctx.ariaLabel
      .split(' ')
      .splice(1)
      .join(' ')}`;
    ctx.ariaLabel = ctx.ariaLabel.replace('not done', 'done');
  }, 2000);
}

allStepTriggers.forEach((stepTrigger) => {
  stepTrigger.addEventListener('click', handleMardDoneOrNotDone);
});
