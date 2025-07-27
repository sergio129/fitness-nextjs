import { AuthWrapper } from '@/components/AuthWrapper';
import DashboardContent from '@/components/DashboardContent';

export default function DashboardPage() {
  return (
    <AuthWrapper>
      <DashboardContent />
    </AuthWrapper>
  );
}
