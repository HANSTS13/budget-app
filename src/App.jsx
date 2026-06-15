import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [budget, setBudget] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const savedBudget = JSON.parse(localStorage.getItem("budget")) || 0;
    const savedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];

    setBudgetAmount(savedBudget);
    setExpenses(savedExpenses);
  }, []);

  useEffect(() => {
    localStorage.setItem("budget", JSON.stringify(budgetAmount));
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [budgetAmount, expenses]);

  const totalExpense = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const balance = budgetAmount - totalExpense;

  function addBudget(e) {
    e.preventDefault();

    if (budget === "" || Number(budget) <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    setBudgetAmount(Number(budget));
    setBudget("");
  }

  function addExpense(e) {
    e.preventDefault();

    if (expenseName.trim() === "" || Number(expenseAmount) <= 0) {
      alert("Please enter valid expense details.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: expenseName,
      amount: Number(expenseAmount),
    };

    setExpenses([...expenses, newExpense]);
    setExpenseName("");
    setExpenseAmount("");
  }

  function deleteExpense(id) {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  }

  function resetAll() {
    setBudgetAmount(0);
    setExpenses([]);
    setBudget("");
    setExpenseName("");
    setExpenseAmount("");
    localStorage.clear();
  }

  return (
    <main className="app">
      <section className="container">
        <h1>Budget Management App</h1>
        <p className="subtitle">
          Track your income, expenses, and remaining balance.
        </p>

        <div className="summary">
          <div className="summary-card budget">
            <h3>Budget</h3>
            <p>₹{budgetAmount}</p>
          </div>

          <div className="summary-card expense">
            <h3>Expenses</h3>
            <p>₹{totalExpense}</p>
          </div>

          <div className={`summary-card ${balance < 0 ? "danger" : "balance"}`}>
            <h3>Balance</h3>
            <p>₹{balance}</p>
          </div>
        </div>

        <div className="forms">
          <form onSubmit={addBudget}>
            <h2>Add Budget</h2>
            <input
              type="number"
              placeholder="Enter total budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <button type="submit">Set Budget</button>
          </form>

          <form onSubmit={addExpense}>
            <h2>Add Expense</h2>
            <input
              type="text"
              placeholder="Expense name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Expense amount"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
            <button type="submit">Add Expense</button>
          </form>
        </div>

        <section className="expense-list">
          <div className="list-header">
            <h2>Expense List</h2>
            <button className="reset-btn" onClick={resetAll}>
              Reset All
            </button>
          </div>

          {expenses.length === 0 ? (
            <p className="empty">No expenses added yet.</p>
          ) : (
            expenses.map((expense) => (
              <div className="expense-item" key={expense.id}>
                <span>{expense.name}</span>
                <strong>₹{expense.amount}</strong>
                <button onClick={() => deleteExpense(expense.id)}>Delete</button>
              </div>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default App;