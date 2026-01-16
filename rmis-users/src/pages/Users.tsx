import { Fish, LogOut } from "lucide-react";
import { UserList } from "@/components/users/UserList";
import { Button } from "@/components/ui/button";
import { useAuthFlow } from "@/hooks/useAuthFlow";

const Users = () => {
  const { handleSignOut, isLoading } = useAuthFlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-white">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#4A5D3F]/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Fish className="h-8 w-8 text-[#4A5D3F] animate-[bounce_2s_ease-in-out_infinite]" />
            <h1 className="text-xl font-bold text-[#4A5D3F]">RMIS User Management</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isLoading}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-[#4A5D3F]/10 p-6">
          <h2 className="text-lg font-semibold text-[#4A5D3F] mb-6">User Management</h2>
          <UserList />
        </div>
      </main>
    </div>
  );
};

export default Users;
