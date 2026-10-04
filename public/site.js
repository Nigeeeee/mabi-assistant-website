const config = window.SITE_CONFIG;
document.querySelectorAll('[data-name]').forEach(el => el.textContent = config.name);
document.querySelectorAll('[data-version]').forEach(el => el.textContent = `MMH v${config.version}`);
const pageName = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.site-nav a').forEach(a => { if(new URL(a.href).pathname.split('/').pop()===pageName)a.setAttribute('aria-current','page'); });
function setTheme(night) {
  document.body.dataset.theme = night ? 'night' : 'day';
  const toggle=document.querySelector('#theme-toggle');
  toggle?.setAttribute('aria-pressed',String(night));
  if(toggle)toggle.textContent=night?'切換晨光':'切換月夜';
  document.querySelectorAll('.paper-corner').forEach(img => img.src=`./assets/ornaments/corner-${night?'night':'day'}.svg`);
  const divider=document.querySelector('.art-divider');if(divider)divider.src=`./assets/ornaments/divider-${night?'night':'day'}.svg`;
  document.querySelectorAll('img[data-day]').forEach(img=>{img.src=night?img.dataset.night:img.dataset.day;const original=img.closest('figure')?.querySelector('a');if(original)original.href=img.src;});
  document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href);if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('theme',night?'night':'day');a.href=u.href;}});
}
setTheme(new URLSearchParams(location.search).get('theme')==='night');
document.querySelector('#theme-toggle')?.addEventListener('click',()=>setTheme(document.body.dataset.theme!=='night'));
if(config.downloadUrl){const url=new URL(config.downloadUrl);if(url.protocol==='https:'&&url.hostname==='github.com'&&/\/releases\/download\//.test(url.pathname)){const button=document.querySelector('#download-button');if(button){const link=document.createElement('a');link.className=button.className;link.href=url.href;link.textContent=`下載 ${config.architecture} ↗`;button.replaceWith(link);document.querySelector('#release-state').textContent='已發布 · GitHub Releases';}}}

document.documentElement.classList.add('js');
const menuToggle=document.querySelector('#nav-toggle');menuToggle?.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));document.querySelector('.site-header').classList.toggle('menu-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuToggle?.getAttribute('aria-expanded')==='true'){menuToggle.click();menuToggle.focus();}});
