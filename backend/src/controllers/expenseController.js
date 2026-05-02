const Expense = require('../models/Expense');

const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, note } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ success: false, error: 'Title, amount, category, and date are required' });
    }

    if (isNaN(amount) || amount < 0.01) {
      return res.status(400).json({ success: false, error: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date,
      note
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const { category, month, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };

    if (category) filter.category = category;

    if (month) {
      const [year, mon] = month.split('-');
      const start = new Date(year, mon - 1, 1);
      const end = new Date(year, mon, 1);
      filter.date = { $gte: start, $lt: end };
    }

    const skip = (page - 1) * limit;
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Expense.countDocuments(filter)
    ]);

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      data: {
        expenses,
        total,
        totalAmount,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allExpenses, monthExpenses, byCategory, recentExpenses] = await Promise.all([
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: { userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]),
      Expense.find({ userId }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      success: true,
      data: {
        totalSpent: allExpenses[0]?.total || 0,
        thisMonth: monthExpenses[0]?.total || 0,
        byCategory: byCategory.map(c => ({ category: c._id, total: c.total, count: c.count })),
        recentExpenses
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "You don't have permission to do that" });
    }

    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "You don't have permission to do that" });
    }

    await expense.deleteOne();
    res.json({ success: true, data: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createExpense, getExpenses, getSummary, updateExpense, deleteExpense };
