// Initialize an array to store transactions and a variable to track the transaction being edited
let transactions = [];
let editingTransactionId = null;

// Add event listener to the "Add Transaction" button
document
  .getElementById("add-transaction")
  .addEventListener("click", function () {
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);

    // Ensure valid inputs for description and amount
    if (description && !isNaN(amount)) {
      if (editingTransactionId !== null) {
        // Edit the existing transaction
        const transaction = transactions.find(
          (t) => t.id === editingTransactionId
        );
        if (transaction) {
          transaction.date = date;
          transaction.description = description;
          transaction.amount = amount;
        }
        editingTransactionId = null; // Reset editing ID
      } else {
        // Add a new transaction
        transactions.push({
          id: Date.now(),
          date,
          description,
          amount,
        });
      }

      // Update UI and persist data
      updateValues();
      saveTransactions();
      clearInputs();
      renderTransactions();
    }
  });

// Add a transaction to the UI
function addTransaction(transaction) {
  const transactionList = document.getElementById("transaction-list");

  // Create a new transaction list item
  const item = document.createElement("li");
  item.className = "flex justify-between items-center p-2 border-b";

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
      <p class="${transaction.amount < 0 ? "text-red-500" : "text-green-500"}">
        ₦${Math.abs(transaction.amount).toFixed(2)}
      </p>
    </div>
    <div class="flex space-x-2">
      <button 
        onclick="editTransaction(${transaction.id})" 
        class="bg-yellow-500 text-white p-2 rounded">Edit</button>
      <button 
        onclick="removeTransaction(${transaction.id})" 
        class="bg-red-500 text-white p-2 rounded">Delete</button>
    </div>
  `;

  transactionList.appendChild(item);
}

// Edit an existing transaction
function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (transaction) {
    // Populate input fields with the transaction details
    document.getElementById("date").value = transaction.date;
    document.getElementById("description").value = transaction.description;
    document.getElementById("amount").value = transaction.amount;

    editingTransactionId = id; // Store the ID of the transaction being edited
  }
}

// Remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateValues();
  saveTransactions();
  renderTransactions();
}

// Update balance, income, and expenses
function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const totalIncome = amounts
    .filter((a) => a > 0)
    .reduce((sum, a) => sum + a, 0)
    .toFixed(2);
  const totalExpenses = amounts
    .filter((a) => a < 0)
    .reduce((sum, a) => sum + a, 0)
    .toFixed(2);
  const balance = amounts.reduce((sum, a) => sum + a, 0).toFixed(2);

  document.getElementById("balance").innerText = `₦${balance}`;
  document.getElementById("total-income").innerText = `₦${totalIncome}`;
  document.getElementById("total-expenses").innerText = `₦${Math.abs(
    totalExpenses
  ).toFixed(2)}`;
}

// Save transactions to local storage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load transactions from local storage
function loadTransactions() {
  const storedTransactions = localStorage.getItem("transactions");
  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
    renderTransactions();
  }
}

// Render all transactions to the UI
function renderTransactions() {
  const transactionList = document.getElementById("transaction-list");
  transactionList.innerHTML = ""; // Clear the list
  transactions.forEach(addTransaction);
}

// Clear input fields
function clearInputs() {
  document.getElementById("date").value = "";
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
}

// Toggle visibility of the transaction list
document
  .getElementById("toggle-transaction-list")
  .addEventListener("click", function () {
    const transactionList = document.getElementById("transaction-list");
    const isHidden =
      transactionList.style.display === "none" ||
      !transactionList.style.display;

    transactionList.style.display = isHidden ? "block" : "none";
    this.textContent = isHidden ? "Hide Transactions" : "Show Transactions";
  });

// Load data and initialize the app
loadTransactions();
updateValues();
