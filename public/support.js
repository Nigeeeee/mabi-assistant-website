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

// OEN is under account review. There is deliberately no checkout URL or payment handler.
// Activation requires the owner's verified hosted link, public email, and hosted minimum.
const oenAmounts = all('#oen-panel [data-oen-amount]');
const oenCustomField = document.querySelector('#oen-custom-field');
const oenCustomAmount = document.querySelector('#oen-custom-amount');
const oenAmountError = document.querySelector('#oen-amount-error');
const oenSelection = document.querySelector('#oen-selection');
function showOenAmount(amount) {
  const custom = amount === 'custom';
  oenCustomField.hidden = !custom;
  const raw = custom ? oenCustomAmount.value.trim() : amount;
  const value = /^\d+$/.test(raw) ? Number(raw) : NaN;
  const valid = Number.isSafeInteger(value) && value >= 30;
  oenCustomAmount.setAttribute('aria-invalid', String(custom && !valid));
  oenAmountError.textContent = custom && !valid ? '金額有誤：請輸入至少 NT$30 的新台幣整數金額。' : '';
  oenSelection.textContent = valid
    ? `已選 NT$${value.toLocaleString('en-US')} · 尚未開放付款`
    : '請輸入至少 NT$30 · 尚未開放付款';
}
oenAmounts.forEach(button => button.addEventListener('click', () => {
  select(oenAmounts, button);
  showOenAmount(button.dataset.oenAmount);
  if (button.dataset.oenAmount === 'custom') oenCustomAmount.focus();
}));
oenCustomAmount.addEventListener('input', () => showOenAmount('custom'));
showOenAmount('100');

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
