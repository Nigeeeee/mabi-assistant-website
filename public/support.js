'use strict';
document.querySelectorAll('[data-name]').forEach(el => el.textContent = window.SITE_CONFIG.name);
document.title = `支持開發｜${window.SITE_CONFIG.name}`;
const all = selector => Array.from(document.querySelectorAll(selector));
function select(buttons, active) { buttons.forEach(b => b.setAttribute('aria-pressed', String(b === active))); }
const methods = all('[data-method]');
methods.forEach(button => button.addEventListener('click', () => {
  select(methods, button);
  document.querySelector('#paypal-panel').hidden = button.dataset.method !== 'paypal';
  document.querySelector('#crypto-panel').hidden = button.dataset.method !== 'crypto';
}));
const amounts = all('[data-amount]');
// Hosted checkout IDs supplied by the account owner.
const hostedIds = {
  '100': 'N3HBNSU35WZ6E',
  '300': 'FRWKKNHXT2PT8',
  '500': 'WEX8CY8K82632',
  '1000': 'WW8MVMTVYBQ4A',
  'custom': 'FMNSMYC3FGKG2'
};
const paypalCheckout = document.querySelector('#paypal-checkout');
function selectAmount(amount) {
  paypalCheckout.href = `https://www.paypal.com/ncp/payment/${hostedIds[amount]}`;
}
amounts.forEach(button => button.addEventListener('click', () => {
  select(amounts, button);
  selectAmount(button.dataset.amount);
}));
selectAmount('100');
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
