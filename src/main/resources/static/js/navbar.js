function toolsManager() {
  const convertToPDF = document.querySelector('#groupConvertTo');
  const convertFromPDF = document.querySelector('#groupConvertFrom');

  if (convertToPDF && convertFromPDF) {
    const itemsTo = Array.from(convertToPDF.querySelectorAll('.dropdown-item')).filter(
      (item) => !item.querySelector('hr.dropdown-divider')
    );
    const itemsFrom = Array.from(convertFromPDF.querySelectorAll('.dropdown-item')).filter(
      (item) => !item.querySelector('hr.dropdown-divider')
    );

    const totalItems = itemsTo.length + itemsFrom.length;

    if (totalItems > 12) {
      document.querySelectorAll('#convertGroup').forEach((element) => (element.style.display = 'none'));
      document.querySelectorAll('#groupConvertTo').forEach((element) => (element.style.display = 'flex'));
      document.querySelectorAll('#groupConvertFrom').forEach((element) => (element.style.display = 'flex'));
    } else {
      document.querySelectorAll('#convertGroup').forEach((element) => (element.style.display = 'flex'));
      document.querySelectorAll('#groupConvertTo').forEach((element) => (element.style.display = 'none'));
      document.querySelectorAll('#groupConvertFrom').forEach((element) => (element.style.display = 'none'));
    }
  }

  document.querySelectorAll('.navbar-item').forEach((element) => {
    if (!element.closest('#stacked')) {
      const dropdownItems = element.querySelectorAll('.dropdown-item');
      const items = Array.from(dropdownItems).filter((item) => !item.querySelector('hr.dropdown-divider'));

      if (items.length === 0) {
        if (
          element.previousElementSibling &&
          element.previousElementSibling.classList.contains('navbar-item') &&
          element.previousElementSibling.classList.contains('nav-item-separator')
        ) {
          element.previousElementSibling.remove();
        }
        element.remove();
      }
    }
  });


  initStickyDropdown();
}

// Sticky dropdown functionality for better UX
function initStickyDropdown() {
  const dropdownToggle = document.querySelector('#navbarDropdown-1');
  const dropdownContainer = dropdownToggle?.closest('.nav-item.dropdown');
  const dropdownMenu = dropdownContainer?.querySelector('.dropdown-menu');
  let hoverTimeout;
  let leaveTimeout;

  if (!dropdownToggle || !dropdownMenu || !dropdownContainer) return;

  // Wait for Bootstrap to be available
  if (typeof bootstrap === 'undefined') {
    console.warn('Bootstrap not loaded, falling back to basic dropdown behavior');
    return;
  }

  // Enhanced hover behavior for the entire dropdown area
  function handleMouseEnter() {
    clearTimeout(hoverTimeout);
    clearTimeout(leaveTimeout);

    // Show dropdown with slight delay to prevent accidental triggers
    hoverTimeout = setTimeout(() => {
      if (!dropdownMenu.classList.contains('show')) {
        try {
          // Use Bootstrap's dropdown API to show
          const bootstrapDropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
          bootstrapDropdown.show();
        } catch (error) {
          console.warn('Error showing dropdown:', error);
          // Fallback to manual show
          dropdownToggle.classList.add('show');
          dropdownMenu.classList.add('show');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        }
      }
    }, 50);
  }

  function handleMouseLeave() {
    clearTimeout(hoverTimeout);
    clearTimeout(leaveTimeout);

    leaveTimeout = setTimeout(() => {

      if (!isMouseOverDropdownArea()) {
        try {
          const bootstrapDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
          if (bootstrapDropdown) {
            bootstrapDropdown.hide();
          }
        } catch (error) {
          console.warn('Error hiding dropdown:', error);
          // Fallback to manual hide
          dropdownToggle.classList.remove('show');
          dropdownMenu.classList.remove('show');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }, 300); // 300ms grace period
  }

  function isMouseOverDropdownArea() {
    return dropdownContainer.matches(':hover') || dropdownMenu.matches(':hover');
  }


  dropdownToggle.addEventListener('mouseenter', handleMouseEnter);
  dropdownToggle.addEventListener('mouseleave', handleMouseLeave);

  dropdownMenu.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    clearTimeout(leaveTimeout);
  });

  dropdownMenu.addEventListener('mouseleave', handleMouseLeave);


  dropdownToggle.addEventListener('click', function(e) {

    clearTimeout(leaveTimeout);
  });

  document.addEventListener('click', function(e) {
    if (!dropdownContainer.contains(e.target)) {
      clearTimeout(hoverTimeout);
      clearTimeout(leaveTimeout);
      try {
        const bootstrapDropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
        if (bootstrapDropdown && dropdownMenu.classList.contains('show')) {
          bootstrapDropdown.hide();
        }
      } catch (error) {
        // Fallback cleanup
        dropdownToggle.classList.remove('show');
        dropdownMenu.classList.remove('show');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

window.tooltipSetup = () => {
  const tooltipElements = document.querySelectorAll('[title]');

  tooltipElements.forEach((element) => {
    const tooltipText = element.getAttribute('title');
    element.removeAttribute('title');
    element.setAttribute('data-title', tooltipText);
    const customTooltip = document.createElement('div');
    customTooltip.className = 'btn-tooltip';
    customTooltip.textContent = tooltipText;

    document.body.appendChild(customTooltip);

    element.addEventListener('mouseenter', (event) => {
      customTooltip.style.display = 'block';
      customTooltip.style.left = `${event.pageX + 10}px`; // Position tooltip slightly away from the cursor
      customTooltip.style.top = `${event.pageY + 10}px`;
    });

    // Update the position of the tooltip as the user moves the mouse
    element.addEventListener('mousemove', (event) => {
      customTooltip.style.left = `${event.pageX + 10}px`;
      customTooltip.style.top = `${event.pageY + 10}px`;
    });

    // Hide the tooltip when the mouse leaves
    element.addEventListener('mouseleave', () => {
      customTooltip.style.display = 'none';
    });
  });
};
document.addEventListener('DOMContentLoaded', () => {
  tooltipSetup();
});
