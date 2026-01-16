import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAgencies } from "@/hooks/useAgencies";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserDialog = ({ open, onOpenChange }: CreateUserDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: agencies } = useAgencies();

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    agency: "",
    role: "user" as "admin" | "user" | "guest",
    status: "active" as "active" | "inactive",
    data_submitter: false,
    folder: "",
    comments: "",
  });

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      agency: "",
      role: "user",
      status: "active",
      data_submitter: false,
      folder: "",
      comments: "",
    });
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name || !formData.agency) {
      toast({
        title: "Validation Error",
        description: "Email, password, name, and agency are required",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: formData
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to create user");
      }

      toast({
        title: "Success",
        description: `User ${formData.email} created successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userEmails'] });

      handleClose();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    if (validateForm()) {
      setShowConfirm(true);
    }
  };

  if (showConfirm) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm User Creation
            </DialogTitle>
            <DialogDescription>
              You are about to create a new user with the following details:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="font-medium">Email:</span>
              <span className="col-span-2">{formData.email}</span>

              <span className="font-medium">Name:</span>
              <span className="col-span-2">{formData.name}</span>

              <span className="font-medium">Agency:</span>
              <span className="col-span-2">{formData.agency}</span>

              <span className="font-medium">Role:</span>
              <span className="col-span-2 capitalize">{formData.role}</span>

              <span className="font-medium">Status:</span>
              <span className="col-span-2 capitalize">{formData.status}</span>

              <span className="font-medium">Data Submitter:</span>
              <span className="col-span-2">{formData.data_submitter ? "Yes" : "No"}</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Confirm & Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Temporary Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agency">Agency *</Label>
              <Select value={formData.agency} onValueChange={(value) => setFormData({ ...formData, agency: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  {agencies?.map((agency) => (
                    <SelectItem key={agency.agency} value={agency.agency || ""}>
                      {agency.agency_name || agency.agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="folder">Folder (Optional)</Label>
              <Input
                id="folder"
                placeholder="Folder path"
                value={formData.folder}
                onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="data_submitter"
              checked={formData.data_submitter}
              onCheckedChange={(checked) => setFormData({ ...formData, data_submitter: checked as boolean })}
            />
            <Label htmlFor="data_submitter" className="cursor-pointer">
              Data Submitter
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Additional notes about this user"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateClick} disabled={isLoading}>
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
