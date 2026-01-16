import { User, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { User as UserType } from "@/types/user";

interface UserTableRowProps {
  user: UserType;
  onUserSelect: (userId: string) => void;
}

export const UserTableRow = ({ user, onUserSelect }: UserTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium py-2">{user.name}</TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          {user.email}
        </div>
      </TableCell>
      <TableCell className="py-2">{user.agency || '-'}</TableCell>
      <TableCell className="py-2">
        <Badge
          variant={
            user.role === 'admin'
              ? 'destructive'
              : user.role === 'user'
              ? 'default'
              : 'secondary'
          }
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <Badge
          variant={user.status === 'active' ? 'default' : 'secondary'}
        >
          {user.status}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <Badge
          variant={user.data_submitter ? 'default' : 'secondary'}
        >
          {user.data_submitter ? 'Yes' : 'No'}
        </Badge>
      </TableCell>
      <TableCell className="text-right py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onUserSelect(user.id)}
        >
          <UserCog className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
