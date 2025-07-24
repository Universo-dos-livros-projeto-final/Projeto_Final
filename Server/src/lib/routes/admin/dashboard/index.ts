import { FastifyInstance } from "fastify";
import { getDashboardInfo } from "./getDashboardInfo";
import { getRecentActivities } from "./getRecentActivities";
import { salesDashboardRoute } from "./salesDashboard"; 

export async function adminDashboardRoutes(app: FastifyInstance) {
  await getDashboardInfo(app);
  await getRecentActivities(app);
  await salesDashboardRoute(app); 
}
