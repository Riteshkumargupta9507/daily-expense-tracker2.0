console.log("Script loaded");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expenseForm");
const table = document.getElementById("expenseTable");

const todayTotalEl = document.getElementById("todayTotal");
const monthTotalEl = document.getElementById("monthTotal");
const topCategoryEl = document.getElementById("topCategory");

let dailyChart, categoryChart;

// Default today
document.getElementById("date").valueAsDate = new Date();

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const expense = {
    date: date.value,
    amount: Number(amount.value),
    category: category.value,
    note: note.value
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  document.getElementById("date").valueAsDate = new Date();
  render();
});

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  render();
}

function render() {
  table.innerHTML = "";

  let todayTotal = 0;
  let monthTotal = 0;
  let categoryTotals = {};
  let dailyTotals = {};

  const today = new Date().toISOString().slice(0,10);
  const currentMonth = today.slice(0,7);

  expenses.forEach((e, index) => {
    table.innerHTML += `
      <tr>
        <td>${e.date}</td>
        <td class="${e.category}">${e.category}</td>
        <td>₹${e.amount}</td>
        <td>${e.note}</td>
        <td><button onclick="deleteExpense(${index})">❌</button></td>
      </tr>
    `;

    if (e.date === today) todayTotal += e.amount;
    if (e.date.startsWith(currentMonth)) monthTotal += e.amount;

    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount;
  });

  todayTotalEl.textContent = "₹" + todayTotal;
  monthTotalEl.textContent = "₹" + monthTotal;

  let topCat = "-";
  let max = 0;
  for (let c in categoryTotals) {
    if (categoryTotals[c] > max) {
      max = categoryTotals[c];
      topCat = c;
    }
  }
  topCategoryEl.textContent = topCat;

  renderCharts(dailyTotals, categoryTotals);
}

function renderCharts(dailyTotals, categoryTotals) {

  // Destroy old charts (important)
  if (dailyChart) dailyChart.destroy();
  if (categoryChart) categoryChart.destroy();

  // DAILY CHART
  dailyChart = new Chart(document.getElementById("dailyChart"), {
    type: "bar",
    data: {
      labels: Object.keys(dailyTotals),
      datasets: [{
        label: "Daily Expense ₹",
        data: Object.values(dailyTotals),
        backgroundColor: "#42a5f5"
      }]
    }
  });

  // CATEGORY CHART
  categoryChart = new Chart(document.getElementById("categoryChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: [
          "orange",
          "blue",
          "red",
          "purple",
          "gray"
        ]
      }]
    }
  });
}

render();
