const guardScreenButtons = document.querySelectorAll('[data-guard-screen]');
const guardScreenPanels = document.querySelectorAll('[data-guard-panel]');
const guardScreenTitle = document.getElementById('guard-screen-title');

guardScreenButtons.forEach(button => {
  button.addEventListener('click', () => {
    const screen = button.dataset.guardScreen;
    guardScreenButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });
    guardScreenPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.guardPanel === screen);
    });
    if (guardScreenTitle) {
      guardScreenTitle.textContent = button.querySelector('b').textContent.toUpperCase();
    }
  });
});
