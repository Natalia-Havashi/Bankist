'use strict';
//js, 1111
//jd, 2222
//stw, 3333
//ss, 4444
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const sorted = sort ? movements.slice().sort((a, b) => a - b) : movements;

  sorted.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov} €</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, value) {
    return acc + value;
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter(movements => movements > 0)
    .reduce((acc, movements) => acc + movements, 0);
  labelSumIn.textContent = `${incomes} € `;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} € `;

  const deposit = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${deposit} €`;
};

const accountsName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
accountsName(accounts);

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  calcPrintBalance(currentAccount);
  calcDisplaySummery(currentAccount);
};

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const loamAmount = Number(inputLoanAmount.value);

  if (
    loamAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loamAmount * 0.1)
  ) {
    currentAccount.movements.push(loamAmount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  const closeName = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);

  if (
    closeName === currentAccount?.username &&
    closePin === currentAccount?.pin
  ) {
    const index = accounts.findIndex(
      account => account.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else {
    alert('Invalid username or password');
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let btnSorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !btnSorted);
  btnSorted = !btnSorted;
});
