import { json } from "@remix-run/node";

export async function action({ request }: any) {
  const { referredCustomers, avgNewProjects, avgExistingProjects } =
    await request.json();

  const referralPayoutRate = 0.2;
  const churnRate = 0.02;
  const newProjectFee = 95;
  const existingProjectFee = 0.25;

  let totalCustomers = 0;
  let monthlyRevenue: number[] = [];
  let currentMonthRevenue = 0;
  
  // Use let for variables that will be updated
  let existingProjects = avgExistingProjects;

  for (let month = 0; month < 12; month++) {
    // Calculate revenue for the new month
    totalCustomers += referredCustomers;
    const newRevenue =
      avgNewProjects * newProjectFee + existingProjects * existingProjectFee;
    const affiliateRevenue = newRevenue * referralPayoutRate;
    currentMonthRevenue += affiliateRevenue;
    monthlyRevenue.push(currentMonthRevenue);

    // Update existing projects for the next month
    existingProjects += avgNewProjects;
    existingProjects -= existingProjects * churnRate;
  }

  return json({ monthlyRevenue });
}
