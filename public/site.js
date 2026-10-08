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
  document.querySelectorAll('img[data-day]').forEach(img=>{
    const src=(night?img.dataset.night:img.dataset.day)||img.dataset.day;
    const link=img.closest('figure')?.querySelector('a');if(link)link.href=src;
    if(img.dataset.demo && !img.dataset.loaded)return;
    if(img.dataset.demo){img.sizes='(max-width: 650px) calc(100vw - 64px), (max-width: 960px) calc(100vw - 64px), 760px';img.srcset=`${src.replace('.webp','-640.webp')} 640w, ${src} ${img.getAttribute('width')}w`;}
    const source=img.closest('picture')?.querySelector('source');
    if(source){const avif=src.replace('.webp','.avif');source.srcset=`${avif.replace('.avif','-640.avif')} 640w, ${avif} ${img.getAttribute('width')}w`;}
    if(img.getAttribute('src')!==src)img.src=src;
  });
  document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href);if(u.origin===location.origin&&u.pathname.endsWith('.html')){u.searchParams.set('theme',night?'night':'day');a.href=u.href;}});
}
// Load only the hero immediately; other demonstrations wait until near the viewport.
const demos=document.querySelectorAll('img[data-demo]');
function loadDemo(img){img.dataset.loaded='true';setTheme(document.body.dataset.theme==='night');}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);loadDemo(entry.target);}});},{rootMargin:'240px'}):null;
demos.forEach(img=>{if(img.closest('.hero')){img.dataset.loaded='true';img.fetchPriority='high';}else if(observer){observer.observe(img);}else{img.dataset.loaded='true';img.loading='lazy';}});
setTheme(new URLSearchParams(location.search).get('theme')==='night');
document.querySelector('#theme-toggle')?.addEventListener('click',()=>setTheme(document.body.dataset.theme!=='night'));
if(config.downloadUrl){const url=new URL(config.downloadUrl);if(url.protocol==='https:'&&url.hostname==='github.com'&&/\/releases\/download\//.test(url.pathname)){const button=document.querySelector('#download-button');if(button){const link=document.createElement('a');link.className=button.className;link.href=url.href;link.textContent=`下載 ${config.architecture} ↗`;button.replaceWith(link);document.querySelector('#release-state').textContent='已發布 · GitHub Releases';}}}

document.documentElement.classList.add('js');
const menuToggle=document.querySelector('#nav-toggle');menuToggle?.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));document.querySelector('.site-header').classList.toggle('menu-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuToggle?.getAttribute('aria-expanded')==='true'){menuToggle.click();menuToggle.focus();}});

// Basic image handling only; this cannot prevent screenshots or developer-tool downloads.
document.querySelectorAll('img').forEach(img=>{
  if(/support-wallet\.png(?:$|[?#])/.test(img.getAttribute('src')||''))return;
  img.dataset.protected='true';img.draggable=false;
  if(!img.closest('.site-header,.hero') && !img.dataset.demo){img.loading='lazy';img.decoding='async';}
});
function protectedImageTarget(target){return target instanceof Element && (target.closest('img[data-protected]') || target.matches('.panorama-stage,.panorama-banner'));}
for(const eventName of ['contextmenu','dragstart'])document.addEventListener(eventName,event=>{if(protectedImageTarget(event.target))event.preventDefault();});
