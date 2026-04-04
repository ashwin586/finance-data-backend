import prisma from "../../config/db";

interface MonthlyTrend {
  month: string;
  totalIncome: number;
  totalExpenses: number;
}

export const getSummaryService = async () => {
  const income = await prisma.transaction.aggregate({
    where: { type: "INCOME", isDeleted: false },
    _sum: { amount: true },
  });
  const expense = await prisma.transaction.aggregate({
    where: { type: "EXPENSE", isDeleted: false },
    _sum: { amount: true },
  });

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpenses = Number(expense._sum.amount ?? 0);
  const netBalance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, netBalance };
};

export const getByCategoryService = async () => {
  const byCategory = await prisma.transaction.groupBy({
    by: ["category"],
    where: { isDeleted: false },
    _sum: { amount: true },
    orderBy: {
      _sum: { amount: "desc" },
    },
  });

  return byCategory.map((item) => ({
    category: item.category,
    total: Number(item._sum.amount ?? 0),
  }));
};

export const getRecentActivityService = async () => {
  const recentActivity = await prisma.transaction.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      amount: true,
      type: true,
      category: true,
      date: true,
      notes: true,
      createdAt: true,
    },
  });
  return recentActivity;
};

export const getTrendsService = async () => {
  const trends = await prisma.transaction.findMany({
    where: { isDeleted: false },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: "asc" },
  });

  const grouped: Record<string, MonthlyTrend> = {};

  for (const transaction of trends) {
    const month = transaction.date.toISOString().slice(0, 7);

    if (!grouped[month]) {
      grouped[month] = { month, totalIncome: 0, totalExpenses: 0 };
    }

    if (transaction.type === "INCOME") {
      grouped[month].totalIncome += Number(transaction.amount);
    } else {
      grouped[month].totalExpenses += Number(transaction.amount);
    }
  }

  return Object.values(grouped);
};
