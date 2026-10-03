const config = window.SITE_CONFIG;
document.title = `${config.name}｜把行囊整理好，再出發`;
document.querySelectorAll('[data-name]').forEach(el => el.textContent = config.name);
document.querySelectorAll('[data-version]').forEach(el => el.textContent = `V${config.version}`);
if (config.downloadUrl) {
  const url = new URL(config.downloadUrl);
  if (url.protocol === 'https:' && url.hostname === 'github.com' && /\/releases\/download\//.test(url.pathname)) {
    const button = document.querySelector('#download-button');
    const link = document.createElement('a');
    link.className = button.className;
    link.href = url.href;
    link.textContent = `下載 ${config.architecture} ↗`;
    button.replaceWith(link);
    document.querySelector('#release-state').textContent = '已發布 · GitHub Releases';
  }
}
