'use strict';

// Get elements from the DOM
const menuBtn = document.getElementById('menubutton');

// Add event listeners
menuBtn.addEventListener('click', toggleMenu);
document.addEventListener('keydown', closeMenu);

// Function to execute
function toggleMenu() {
  document.getElementById('menu-content').classList.toggle('menu-open');

  // change the aria-* attribute
  // Focus on first menu item or button
  if (menuBtn.attributes['aria-expanded'].value === 'true') {
    menuBtn.ariaExpanded = 'false';
    menuBtn.focus();
  } else {
    menuBtn.ariaExpanded = 'true';
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    menuItems.item(0).focus();
  }
}

function closeMenu(e) {
  if (e.keyCode === 27 && menuBtn.attributes['aria-expanded'].value === 'true')
    toggleMenu();
}
