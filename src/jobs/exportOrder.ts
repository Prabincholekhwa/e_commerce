import cron from 'node-cron';
import { exportOrders } from '../utils/helpers';

export function scheduleOrderReportExport() {
  cron.schedule(
    '59 23 * * *',
    async () => {
      await exportOrders();
    },
    {
      timezone: 'Asia/Kathmandu',
    }
  );
}
