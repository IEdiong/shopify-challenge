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

const allStepDetailSummary = document.querySelectorAll('.step__details');

const progressLevel = document.getElementById('progress-level');
const levelNumber = document.getElementById('level');

const calloutAnnouncer = document.getElementById('callout-live');

progressLevel.style.width = 0;

let escapeListner,
  menuNavigation,
  el = 0;

let openedWithKeyboard = false;

const tabListOpenState = [true, false, false, false, false];

for (let i = 0; i < tabListOpenState.length; i++) {
  if (tabListOpenState[i] === true) {
    allStepDetailSummary.item(i).classList.remove('hide-details');
  } else {
    allStepDetailSummary.item(i).classList.add('hide-details');
  }
}

// Add event listeners
menuBtn.addEventListener('click', toggleMenuOnClick);
menuBtn.addEventListener('keyup', toggleMenuOnTab);
notificationBtn.addEventListener('click', toggleNotification);
trailCloseBtn.addEventListener('click', closeCallout);
stepsToggleBtn.addEventListener('click', toggleStepsToggle);

// Function to execute
function toggleMenuOnClick(event) {
  // change the aria-* attribute
  // Focus on first menu item or button

  openedWithKeyboard = true;

  if (menuBtn.attributes['aria-expanded'].value === 'true') {
    closeMenu();
  } else {
    openMenu();
  }
}

function toggleMenuOnTab(event) {
  event.preventDefault();

  if (
    event.key === 'Enter' ||
    event.key === ' ' ||
    (event.ctrlKey && event.altKey && event.key === ' ')
  ) {
    openedWithKeyboard = true;
    if (menuBtn.attributes['aria-expanded'].value === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  }
}

function closeMenu() {
  menu.classList.toggle('menu-open');
  menuBtn.ariaExpanded = 'false';
  if (openedWithKeyboard) menuBtn.focus();

  menu.removeEventListener('keyup', escapeListner);
  menu.removeEventListener('keyup', menuNavigation);
}

function openMenu() {
  el = 0;
  menu.classList.toggle('menu-open');
  menuBtn.ariaExpanded = 'true';

  if (openedWithKeyboard) {
    menuItems.item(el).focus({ focusVisibility: 'true' });
  }

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

  calloutAnnouncer.ariaLabel = 'You just closed the plan selection dialogue';
}

// ! Toggle Accordion Card
function toggleStepsToggle() {
  stepsList.classList.toggle('hidden');
  stepsToggleBtn.classList.toggle('toggle-open');
  stepsToggleBtn.ariaExpanded == 'false' ? 'true' : 'false';
}

// ! Toggle Step details
allStepDetailSummary.forEach((stepSummary) => {
  stepSummary.addEventListener('click', toggleStepDetails);
});

function toggleStepDetails() {
  const currentStep = this;
  allStepDetailSummary.forEach((stepDetails) => {
    if (stepDetails === currentStep) {
      stepDetails.classList.remove('hide-details');
    } else {
      stepDetails.classList.add('hide-details');
    }
  });
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

    let width = 0;

    allStepTriggers.forEach((step) => {
      step.classList.contains(MARKED_AS_DONE) ? (width += 14.4) : null;
    });
    levelNumber.textContent = width / 14.4;
    progressLevel.style.width = width;
    document.querySelector("[role='progressbar']").ariaValueNow;

    if (width === 72) {
      allStepDetailSummary.forEach((summary) => {
        summary.classList.add('hide-details');
      });
    } else {
      let isFirstMatchFound = false;

      allStepDetailSummary.forEach((summary) => {
        if (
          summary.classList.contains('hide-details') &&
          !summary.classList.contains('done') &&
          !isFirstMatchFound
        ) {
          summary.classList.remove('hide-details');
          isFirstMatchFound = true;
        }
      });
      const parent = findParentWithClass(ctx, 'step__details');
      parent.classList.add('done');

      allStepDetailSummary.forEach(
        (summary) =>
          summary.classList.contains('done') &&
          summary.classList.add('hide-details')
      );
    }
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

    let width = 0;

    allStepTriggers.forEach((step) => {
      step.classList.contains(MARKED_AS_DONE) ? (width += 14.4) : null;
    });
    levelNumber.textContent = width / 14.4;
    progressLevel.style.width = width;

    const parent = findParentWithClass(ctx, 'step__details');
    parent.classList.remove('done');
  }, 2000);
}

allStepTriggers.forEach((stepTrigger) => {
  stepTrigger.addEventListener('click', handleMardDoneOrNotDone);
});

function findParentWithClass(element, className) {
  let currentElement = element;

  // Keep traversing up the DOM tree until we find the desired class or reach the top
  while (currentElement && !currentElement.classList.contains(className)) {
    currentElement = currentElement.parentNode;
  }

  // Return the found element or null if not found
  return currentElement;
}
