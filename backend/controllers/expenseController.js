const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, currency } = req.body;

    const expense = await Expense.create({
      user: req.user,
      title,
      amount,
      category,
      currency,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
