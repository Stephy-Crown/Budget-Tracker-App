// Initialization of variables
let transactions = [];
// Variable to store the ID of the transaction being edited
let editingTransactionId = null;

// Grabbing and editing the add transaction and adding event listener

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const totalIncome = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);
  const totalExpenses = amounts
    .filter((amount) => amount < 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);
  const balance = amounts
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);

  document.getElementById("balance").innerText = `$${balance}`;
  document.getElementById("total-income").innerText = `$${totalIncome}`;
  document.getElementById("total-expenses").innerText = `$${Math.abs(
    totalExpenses
  ).toFixed(2)}`;
}

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
// Function for the transaction lst
function addTransaction(transaction) {
  const transactionList = document.getElementById("transaction-list");

  const item = document.createElement("li");
  item.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "p-2",
    "border-b"
  );

  item.innerHTML = `
      <div>
          <p class="font-bold">Date:</p>
          <p>${transaction.date}</p>
      </div>
      <div>
          <p class="font-bold">Description:</p>
          <p>${transaction.description}</p>
      </div>
      <div>
          <p class="font-bold">Amount:</p>
          <p class="${
            transaction.amount < 0 ? "text-red-500" : "text-green-500"
          }">${transaction.amount < 0 ? "-" : ""}$${Math.abs(
    transaction.amount
  ).toFixed(2)}</p>
      </div>
      <div class="flex space-x-2">
          <button onclick="editTransaction(${
            transaction.id
          })" class="bg-yellow-500  p-2 rounded">Edit</button>
          <button onclick="removeTransaction(${
            transaction.id
          })" class="bg-red-500 text-white p-2 rounded">Delete</button>
      </div>
  `;

  transactionList.appendChild(item);
}

function renderTransactions() {
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = "";
  transactions.forEach(addTransaction);
}

function clearInputs() {
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

function loadTransactions() {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
    renderTransactions();
  }
}
loadTransactions();
updateValues();

document
  .getElementById("add-transaction")
  .addEventListener("click", function () {
    const dateInput = document.getElementById("date");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");

    const date = dateInput.value;
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (description && !isNaN(amount)) {
      if (editingTransactionId !== null) {
        const transaction = transactions.find(
          (transaction) => transaction.id === editingTransactionId
        );
        if (transaction) {
          transaction.date = date;
          transaction.description = description;
          transaction.amount = amount;
        }
        editingTransactionId = null; // Reset the editing ID
      } else {
        const transaction = {
          id: Date.now(),
          date: date,
          description: description,
          amount: amount,
        };
        transactions.push(transaction);
      }

      updateValues();
      saveTransactions();
      clearInputs();
      renderTransactions();
    }
  });

// Functionality for editing and deleting transactions
function editTransaction(id) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  if (transaction) {
    document.getElementById("date").value = transaction.date;
    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;

    editingTransactionId = id; // Store the ID of the transaction being edited
  }
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateValues();
  saveTransactions();
  renderTransactions();
}

document
  .getElementById("toggle-transaction-list")
  .addEventListener("click", function () {
    const transactionList = document.getElementById("transaction-list");
    if (
      transactionList.style.display === "none" ||
      transactionList.style.display === ""
    ) {
      transactionList.style.display = "block";
      this.textContent = "Hide Transactions";
    } else {
      transactionList.style.display = "none";
      this.textContent = "Show Transactions";
    }
  });
