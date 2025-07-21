import { FastifyInstance } from "fastify";
import { getDashboardInfo } from "./getDashboardInfo";
import { getRecentActivities } from "./getRecentActivities";

export async function adminDashboardRoutes(app: FastifyInstance) {
  await getDashboardInfo(app);
  await getRecentActivities(app);
}
