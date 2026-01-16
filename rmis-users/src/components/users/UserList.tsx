import { useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserProfile } from "./UserProfile";
import { UserTableRow } from "./UserTableRow";
import { CreateUserDialog } from "./CreateUserDialog";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SortField = 'name' | 'email' | 'agency';
type SortDirection = 'asc' | 'desc';

export const UserList = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dataSubmitterFilter, setDataSubmitterFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { users, isLoading } = useUsers();
  const { session } = useAuth();

  const { data: isAdmin } = useQuery({
    queryKey: ['isAdmin', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
      return data?.role === 'admin';
    },
    enabled: !!session?.user?.id,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = users
    ?.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.agency?.toLowerCase().includes(searchTerm.toLowerCase());

      const isNotDeleted = user.status !== 'deleted';
      const matchesStatus = statusFilter === "all"
        ? isNotDeleted
        : user.status === statusFilter;

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesDataSubmitter = dataSubmitterFilter === "all" ||
        (dataSubmitterFilter === "yes" ? user.data_submitter : !user.data_submitter);

      return matchesSearch && matchesStatus && matchesRole && matchesDataSubmitter;
    })
    .sort((a: User, b: User) => {
      const aValue = a[sortField]?.toLowerCase() ?? '';
      const bValue = b[sortField]?.toLowerCase() ?? '';

      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[300px]"
            />
          </div>

          {isAdmin && (
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dataSubmitterFilter} onValueChange={setDataSubmitterFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by data submitter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data Submitters</SelectItem>
                <SelectItem value="yes">Data Submitters</SelectItem>
                <SelectItem value="no">Non-Data Submitters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-700">
          <span>
            Showing {filteredAndSortedUsers?.length} {filteredAndSortedUsers?.length === 1 ? 'user' : 'users'}
            {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || dataSubmitterFilter !== 'all') &&
              ` (filtered from ${users?.length} total)`}
          </span>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('agency')}
                >
                  Agency {sortField === 'agency' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Submitter</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedUsers?.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onUserSelect={setSelectedUser}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <UserProfile
              userId={selectedUser}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};
