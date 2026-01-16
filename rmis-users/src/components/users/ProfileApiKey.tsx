import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Mail, KeyRound, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface ProfileApiKeyProps {
  apiKey: string;
  userEmail: string;
  userName: string;
  userId: string;
}

export const ProfileApiKey = ({ apiKey, userEmail, userName, userId }: ProfileApiKeyProps) => {
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSending, setIsSending] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const sendApiKeyEmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('send-api-key-email', {
        body: { userEmail, userName, apiKey }
      });

      if (error) throw error;

      toast({
        title: "Email sent",
        description: "API key and instructions have been sent to the user's email.",
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send API key email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendPasswordResetEmail = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Reset email sent",
        description: "Password reset instructions have been sent to the user's email.",
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetUserPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('reset-user-password', {
        body: { userId, newPassword }
      });

      if (error) throw error;

      toast({
        title: "Password reset successfully",
        description: `Password has been updated for ${userName}`,
      });
      setShowPasswordDialog(false);
      setNewPassword("");
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">API Key</label>
      <div className="flex gap-2">
        <Input value={apiKey} readOnly className="font-mono text-xs" />
        <Button
          variant="outline"
          size="icon"
          onClick={copyApiKey}
          title="Copy API Key"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              Email API Key
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send API Key Email</AlertDialogTitle>
              <AlertDialogDescription>
                This will send an email containing the API key and usage instructions to {userEmail}. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={sendApiKeyEmail}>
                Send Email
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Send Password Reset
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Password Reset Email</AlertDialogTitle>
              <AlertDialogDescription>
                This will send a password reset email to {userEmail}. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={sendPasswordResetEmail}>
                Send Email
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              Set New Password
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set New Password</DialogTitle>
              <DialogDescription>
                Enter a new password for {userName}. The user will be able to log in immediately with this password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={resetUserPassword} disabled={isSending}>
                {isSending ? "Setting..." : "Set Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
