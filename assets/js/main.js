// Sidebar Toggle
const sidebar = document.querySelector('aside.sidebar');
const menuTrigger = document.querySelector('button.menu-trigger');
const menuTriggerClose = document.querySelector('button.menu-trigger-close');
const menuOpacity = document.querySelector('div.menu-overlay');

const toggleSidebar = () => {
  if (sidebar.classList.contains('!translate-x-0')) {
    sidebar.classList.remove('!translate-x-0')
    menuOpacity.classList.add('hidden')
  } else {
    sidebar.classList.add('!translate-x-0')
    menuOpacity.classList.remove('hidden')
  }
}

menuTrigger.addEventListener('click', toggleSidebar)
menuTriggerClose.addEventListener('click', toggleSidebar)
menuOpacity.addEventListener('click', toggleSidebar)

// Blog Page Scroll restoration
const scrollElement = document.querySelector('.scroll-area');
const scrollElementStateKey = "ScrollElementPosition";
window.onbeforeunload = function () {
  if (!scrollElement) return;
  const scrollPos = scrollElement.scrollTop;
  if (scrollPos) {
    localStorage.setItem(scrollElementStateKey, scrollPos)
  }
}
window.onload = function () {
  const scrollPos = localStorage.getItem(scrollElementStateKey)
  localStorage.removeItem(scrollElementStateKey);
  if (scrollElement) {
    scrollElement.scrollTop = scrollPos
  }
}

// Theme mode (system / light / dark)
const themeToggle = document.querySelector('.dark-mode-toggle');
const themeStateKey = "ThemePreference";
const systemMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const normalizeThemePreference = (value) => {
  if (value === 'light' || value === 'dark' || value === 'system') return value;
  return null;
}

const readThemePreference = () => {
  return normalizeThemePreference(localStorage.getItem(themeStateKey));
}

let themePreference = readThemePreference() || 'system';

const getSystemIsDark = () => {
  if (!systemMedia) return false;
  return systemMedia.matches;
}

const updateThemeToggleUI = (preference) => {
  if (!themeToggle) return;
  const label = themeToggle.querySelector('[data-theme-label]');
  const icons = themeToggle.querySelectorAll('[data-theme-icon]');
  const labelText = preference === 'system' ? 'Auto' : (preference === 'dark' ? 'Dark' : 'Light');
  themeToggle.setAttribute('data-theme-state', preference);
  themeToggle.setAttribute('aria-label', `Theme: ${labelText.toLowerCase()}`);
  themeToggle.setAttribute('title', `Theme: ${labelText.toLowerCase()}`);
  if (label) label.textContent = labelText;
  icons.forEach((icon) => {
    icon.classList.toggle('hidden', icon.dataset.themeIcon !== preference);
  })
}

const applyThemePreference = (preference) => {
  const shouldBeDark = preference === 'dark' || (preference === 'system' && getSystemIsDark());
  document.documentElement.classList.toggle('dark', shouldBeDark);
  updateThemeToggleUI(preference);
}

applyThemePreference(themePreference);

if (systemMedia) {
  const onSystemChange = () => {
    if (themePreference === 'system') applyThemePreference(themePreference);
  };
  if (systemMedia.addEventListener) {
    systemMedia.addEventListener('change', onSystemChange);
  } else if (systemMedia.addListener) {
    systemMedia.addListener(onSystemChange);
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const order = ['system', 'light', 'dark'];
    const currentIndex = order.indexOf(themePreference);
    themePreference = order[(currentIndex + 1) % order.length];
    localStorage.setItem(themeStateKey, themePreference);
    applyThemePreference(themePreference);
  })
}
