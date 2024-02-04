const fs = require('fs');
const path = require('path');
const { program } = require('commander');


const expensesFilePath = path.join(__dirname, 'expenses.json');


function writeExpensesToFile(expenses) {
    fs.writeFileSync(expensesFilePath, JSON.stringify(expenses, null, 2));
}


function readExpensesFromFile() {
    try {
        const data = fs.readFileSync(expensesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


function createExpense(total, category, date) {
    const newExpense = {
        id: Date.now(),
        total,
        category,
        date
    };
    const expenses = readExpensesFromFile();
    expenses.push(newExpense);
    writeExpensesToFile(expenses);
    console.log('Expense created successfully:', newExpense);
}

function deleteExpense(id) {
    let expenses = readExpensesFromFile();
    expenses = expenses.filter(expense => expense.id !== parseInt(id));
    writeExpensesToFile(expenses);
    console.log(`Expense with ID ${id} deleted successfully.`);
}

function searchExpenseByCategory(category) {
    const expenses = readExpensesFromFile();
    const filteredExpenses = expenses.filter(expense => expense.category.toLowerCase() === category.toLowerCase());
    console.log(`Expenses for category '${category}':`);
    console.log(filteredExpenses);
}

program
    .command('create-expense <total> <category> <date>')
    .description('Create a new expense')
    .action(createExpense);

program
    .command('delete-expense <id>')
    .description('Delete an expense by ID')
    .action(deleteExpense);

program
    .command('search-expense')
    .option('-c, --category <category>', 'Search expenses by category')
    .description('Search expenses')
    .action((options) => {
        if (options.category) {
            searchExpenseByCategory(options.category);
        } else {
            console.log('Please provide a category to search expenses.');
        }
    });

program.parse(process.argv);