const oneScreenButtons = document.querySelectorAll('[data-one-screen]');
const oneScreenPanels = document.querySelectorAll('[data-one-panel]');
const oneScreenTitle = document.getElementById('one-screen-title');

oneScreenButtons.forEach(button => {
  button.addEventListener('click', () => {
    const screen = button.dataset.oneScreen;

    oneScreenButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    oneScreenPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.onePanel === screen);
    });

    if (oneScreenTitle) {
      oneScreenTitle.textContent = button.querySelector('b').textContent.toUpperCase();
    }
  });
});
