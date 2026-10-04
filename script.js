// ==========================================
// SMART EXPENSE TRACKER
// ==========================================

let transactions =
    JSON.parse(
        localStorage.getItem("smartExpenses")
    ) || [];


// ==========================================
// ELEMENTS
// ==========================================

const transactionForm =
    document.getElementById("transactionForm");

const typeInput =
    document.getElementById("type");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const descriptionInput =
    document.getElementById("description");

const dateInput =
    document.getElementById("date");

const searchInput =
    document.getElementById("search");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");

const transactionList =
    document.getElementById("transactionList");


// ==========================================
// DEFAULT DATE
// ==========================================

dateInput.value =
    new Date().toISOString().split("T")[0];


// ==========================================
// FORM SUBMIT
// ==========================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const type =
            typeInput.value;

        const amount =
            Number(amountInput.value);

        const category =
            categoryInput.value;

        const description =
            descriptionInput.value.trim();

        const date =
            dateInput.value;


        if (
            amount <= 0 ||
            description === "" ||
            date === ""
        ) {

            alert(
                "Please enter valid transaction details."
            );

            return;

        }


        const transaction = {

            id: Date.now(),

            type: type,

            amount: amount,

            category: category,

            description: description,

            date: date

        };


        transactions.unshift(
            transaction
        );


        saveTransactions();

        transactionForm.reset();


        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];


        displayTransactions();

    }
);


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveTransactions() {

    localStorage.setItem(
        "smartExpenses",
        JSON.stringify(transactions)
    );

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        filterType.value;

    const selectedCategory =
        filterCategory.value;


    const filtered =
        transactions.filter(
            transaction => {

                const matchesSearch =
                    transaction.description
                        .toLowerCase()
                        .includes(search) ||
                    transaction.category
                        .toLowerCase()
                        .includes(search);


                const matchesType =
                    selectedType === "all" ||
                    transaction.type === selectedType;


                const matchesCategory =
                    selectedCategory === "all" ||
                    transaction.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );

            }
        );


    transactionList.innerHTML = "";


    if (filtered.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-message">

                <h3>
                    No transactions found
                </h3>

                <p>
                    Add your first income or expense.
                </p>

            </div>

        `;

        updateDashboard();

        return;

    }


    filtered.forEach(
        transaction => {

            const card =
                document.createElement("div");

            card.className =
                "transaction-card";


            const amountClass =
                transaction.type === "income"
                    ? "income-amount"
                    : "expense-amount";


            const typeBadge =
                transaction.type === "income"
                    ? "income-badge"
                    : "expense-badge";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            card.innerHTML = `

                <div class="transaction-info">

                    <h3>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            transaction.category
                        )}
                    </p>

                    <div class="transaction-meta">

                        <span class="badge category-badge">
                            ${escapeHTML(
                                transaction.category
                            )}
                        </span>

                        <span class="badge ${typeBadge}">
                            ${transaction.type}
                        </span>

                    </div>

                </div>


                <div class="transaction-right">

                    <div class="transaction-amount ${amountClass}">
                        ${sign} ₹${formatAmount(
                            transaction.amount
                        )}
                    </div>

                    <span class="transaction-date">
                        ${formatDate(
                            transaction.date
                        )}
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            transactionList.appendChild(card);

        }
    );


    updateDashboard();

}


// ==========================================
// FORMAT AMOUNT
// ==========================================

function formatAmount(amount) {

    return amount.toLocaleString("en-IN");

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(date) {

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ==========================================
// DELETE TRANSACTION
// ==========================================

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {

        return;

    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    displayTransactions();

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type === "income"
            ) {

                income +=
                    transaction.amount;

            } else {

                expense +=
                    transaction.amount;

            }

        }
    );


    const balance =
        income - expense;


    document.getElementById(
        "totalIncome"
    ).innerText =
        "₹" + formatAmount(income);


    document.getElementById(
        "totalExpense"
    ).innerText =
        "₹" + formatAmount(expense);


    document.getElementById(
        "balance"
    ).innerText =
        "₹" + formatAmount(balance);


    document.getElementById(
        "transactionCount"
    ).innerText =
        transactions.length;

}


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    displayTransactions
);


// ==========================================
// FILTER TYPE
// ==========================================

filterType.addEventListener(
    "change",
    displayTransactions
);


// ==========================================
// FILTER CATEGORY
// ==========================================

filterCategory.addEventListener(
    "change",
    displayTransactions
);


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayTransactions();  