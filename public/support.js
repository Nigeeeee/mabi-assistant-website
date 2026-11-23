'use strict';
document.querySelectorAll('[data-name]').forEach(el => el.textContent = window.SITE_CONFIG.name);
// Keep the page-specific search title declared in support.html.
const all = selector => Array.from(document.querySelectorAll(selector));
function select(buttons, active) { buttons.forEach(b => b.setAttribute('aria-pressed', String(b === active))); }
const methods = all('[data-method]');
methods.forEach(button => button.addEventListener('click', () => {
  select(methods, button);
  ['oen', 'paypal', 'crypto'].forEach(method => {
    document.querySelector(`#${method}-panel`).hidden = button.dataset.method !== method;
  });
}));
const amounts = all('#paypal-panel [data-amount]');
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

// Public payment links supplied by the merchant. OEN collects payment details.
const oenAmounts = all('#oen-panel [data-oen-amount]');
const oenSelection = document.querySelector('#oen-selection');
const oenHostedCheckout = document.querySelector('#oen-hosted-checkout');
const oenCheckoutNote = document.querySelector('#oen-checkout-note');

function selectOenAmount(button) {
  const url = new URL(button.dataset.oenCheckout);
  if (url.origin !== 'https://starryweaver.oen.tw' ||
      !/^\/payment-url\/[A-Za-z0-9]+$/.test(url.pathname) ||
      url.username || url.password || url.search || url.hash) {
    throw new Error('Invalid OEN payment link');
  }

  const custom = button.dataset.oenAmount === 'custom';
  const amount = Number(button.dataset.oenAmount).toLocaleString('en-US');
  oenHostedCheckout.href = url.href;
  oenSelection.textContent = custom
    ? '請在應援付款頁自行輸入金額'
    : '已選 NT$' + amount;
  oenCheckoutNote.textContent = custom
    ? '每次最低 NT$30，請在應援付款頁輸入金額。'
    : '每次最低 NT$30。請在應援付款頁確認金額後付款。';
}

oenAmounts.forEach(button => button.addEventListener('click', () => {
  selectOenAmount(button);
  select(oenAmounts, button);
}));
selectOenAmount(oenAmounts.find(button => button.getAttribute('aria-pressed') === 'true'));

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
