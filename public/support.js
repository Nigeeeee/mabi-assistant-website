'use strict';
const themeToggle = document.querySelector('#theme-toggle');
function setTheme(night) {
  document.body.dataset.theme = night ? 'night' : 'day';
  themeToggle.setAttribute('aria-pressed', String(night));
  themeToggle.textContent = night ? '切換晨光' : '切換月夜';
  document.querySelectorAll('.paper-corner').forEach(img => img.src = `./assets/ornaments/corner-${night ? 'night' : 'day'}.svg`);
  document.querySelector('.art-divider').src = `./assets/ornaments/divider-${night ? 'night' : 'day'}.svg`;
}
setTheme(new URLSearchParams(location.search).get('theme') === 'night');
themeToggle.addEventListener('click', () => setTheme(document.body.dataset.theme !== 'night'));
const all = selector => Array.from(document.querySelectorAll(selector));
function select(buttons, active) { buttons.forEach(b => b.setAttribute('aria-pressed', String(b === active))); }
const methods = all('[data-method]');
methods.forEach(button => button.addEventListener('click', () => {
  select(methods, button);
  document.querySelector('#paypal-panel').hidden = button.dataset.method !== 'paypal';
  document.querySelector('#crypto-panel').hidden = button.dataset.method !== 'crypto';
}));
const amounts = all('[data-amount]');
const custom = document.querySelector('#custom-amount');
const paypalCheckout = document.querySelector('#paypal-checkout');
const paypalBase = 'https://paypal.me/StarryWeaverStudio';
function updateCheckout(value) {
  const valid = Number.isSafeInteger(value) && value > 0;
  paypalCheckout.setAttribute('aria-disabled', String(!valid));
  if (valid) paypalCheckout.href = `${paypalBase}/${value}TWD`;
  else paypalCheckout.removeAttribute('href');
}
paypalCheckout.addEventListener('click', event => {
  if (paypalCheckout.getAttribute('aria-disabled') === 'true') event.preventDefault();
});
function updateCustom() {
  const value = Number(custom.value);
  const valid = custom.value.trim() !== '' && Number.isSafeInteger(value) && value > 0;
  updateCheckout(valid ? value : NaN);
  document.querySelector('#selection').textContent = valid ? `這份心意：NT$${value.toLocaleString('en-US')}` : '請輸入你的贊助金額';
  document.querySelector('#amount-error').textContent = custom.value && !valid ? '請輸入大於零的整數金額。' : '';
}
amounts.forEach(button => button.addEventListener('click', () => {
  select(amounts, button);
  const isCustom = button.dataset.amount === 'custom';
  document.querySelector('#custom-field').hidden = !isCustom;
  if (isCustom) { updateCustom(); custom.focus(); }
  else {
    updateCheckout(Number(button.dataset.amount));
    document.querySelector('#selection').textContent = `這份心意：NT$${Number(button.dataset.amount).toLocaleString('en-US')}`;
  }
}));
custom.addEventListener('input', updateCustom);
updateCheckout(100);
const coins = all('[data-coin]');
coins.forEach(button => button.addEventListener('click', () => {
  select(coins, button);
  document.querySelector('#coin-title').textContent = button.dataset.coin;
  document.querySelector('#transfer-title').textContent = `請只轉入 ${button.dataset.coin} · BEP20`;
  document.querySelector('#copy-status').textContent = '';
}));
document.querySelector('#copy-address').addEventListener('click', async () => {
  const address = document.querySelector('#wallet-address');
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(address.value); status.textContent = '已複製收款地址，轉帳前請再核對幣種與 BEP20 網路。'; }
  catch { address.focus(); address.select(); status.textContent = '請手動複製已選取的完整地址。'; }
});
