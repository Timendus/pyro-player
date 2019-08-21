class InfoBox {}
InfoBox.warn = (title, message) => {
  const infoSection = document.querySelector('section.info');
  infoSection.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
  infoSection.classList.add('show');
}
