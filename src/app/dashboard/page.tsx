import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import DashboardLayout from "@/components/DashboardLayout";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login'); 
  }

  return (
    <div className="flex flex-col h-dvh overflow-y-auto bg-background-alternative font-space-grotesk bg-primary text-secondary">
      <Header />
      <main className="flex-1 flex flex-col">
        {/* <DashboardLayout 
          initialTickets={tickets}
          initialMetrics={initialMetrics}
          accessToken={token}
        /> */}
      </main>
    </div>
  );
}
