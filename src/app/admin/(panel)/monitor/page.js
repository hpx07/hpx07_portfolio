import MonitorBoard from '@/components/admin/MonitorBoard'
import { getMonitorSummary } from '@/lib/repos'

export const dynamic = 'force-dynamic'

export default async function AdminMonitorPage() {
  const summary = await getMonitorSummary().catch(() => [])
  return <MonitorBoard summary={summary} />
}
