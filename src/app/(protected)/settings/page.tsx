'use client'

import { useEffect, useState } from 'react';
import { User, Key, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';

export default function Settings() {
  const [defaultLogRetention, setDefaultLogRetention] = useState('30');
  const [defaultRetries, setDefaultRetries] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isLoaded) setIsLoaded(true);
  }, [isLoaded]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[var(--foreground)] mb-2">Settings</h1>
        <p className="text-[var(--muted-foreground)]">
          Manage your account and application preferences
        </p>
      </div>

      {/* Account Information */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
            <User className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <h3 className="text-[var(--foreground)]">Account Information</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account-name" className="text-[var(--muted-foreground)]">
                Name
              </Label>
              <Input
                id="account-name"
                defaultValue="John Doe"
                className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
              />
            </div>
            <div>
              <Label htmlFor="account-email" className="text-[var(--muted-foreground)]">
                Email
              </Label>
              <Input
                id="account-email"
                type="email"
                defaultValue="john@example.com"
                className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
              />
            </div>
          </div>

          <Separator className="bg-[var(--border)]" />

          <div>
            <h4 className="text-[var(--muted-foreground)] mb-4">Change Password</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="current-password" className="text-[var(--muted-foreground)]">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-password" className="text-[var(--muted-foreground)]">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-[var(--muted-foreground)]">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)]">
              Update Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Global Preferences */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[var(--accent)]/10 p-2 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-[var(--accent-foreground)]" />
          </div>
          <h3 className="text-[var(--foreground)]">Global Preferences</h3>
        </div>

        <div className="space-y-6">
          {isLoaded && (
            <div>
              <Label htmlFor="theme" className="text-[var(--muted-foreground)]">
                Theme
              </Label>
              <Select defaultValue={theme} value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[var(--muted-foreground)] mt-1">
                Choose your preferred color theme
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="default-log-retention" className="text-[var(--muted-foreground)]">
              Default Log Retention
            </Label>
            <Select value={defaultLogRetention} onValueChange={setDefaultLogRetention}>
              <SelectTrigger className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="120">120 Days</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[var(--muted-foreground)] mt-1">
              Default retention period
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="default-retries" className="text-[var(--muted-foreground)]">
                Enable Retries by Default
              </Label>
              <p className="text-[var(--muted-foreground)] mt-1">
                Automatically enable retry logic for new projects
              </p>
            </div>
            <Switch
              id="default-retries"
              checked={defaultRetries}
              onCheckedChange={setDefaultRetries}
            />
          </div>

          <div className="pt-4">
            <Button className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)]">
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[var(--secondary)]/10 p-2 rounded-lg">
            <Key className="w-5 h-5 text-[var(--secondary-foreground)]" />
          </div>
          <h3 className="text-[var(--foreground)]">API Keys</h3>
        </div>

        <p className="text-[var(--muted-foreground)] mb-4">
          Manage API keys for programmatic access to your webhook forwarder
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--foreground)]">Production API Key</p>
              <Button size="sm" variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                Revoke
              </Button>
            </div>
            <code className="text-[var(--muted-foreground)] text-sm">sk_prod_••••••••••••••••••••••••1234</code>
            <p className="text-[var(--muted-foreground)] mt-2">Created on Oct 15, 2024</p>
          </div>

          <div className="p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--foreground)]">Development API Key</p>
              <Button size="sm" variant="outline" className="border-[var(--border)] text-[var(--muted-foreground)]">
                Revoke
              </Button>
            </div>
            <code className="text-[var(--muted-foreground)] text-sm">sk_dev_••••••••••••••••••••••••5678</code>
            <p className="text-[var(--muted-foreground)] mt-2">Created on Oct 20, 2024</p>
          </div>

          <Button variant="outline" className="border-[var(--border)] text-[var(--foreground)]">
            Generate New API Key
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[var(--card)] border border-[var(--destructive)]/20 p-6">
        <h3 className="text-[var(--destructive)] mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[var(--destructive)]/10 rounded-lg border border-[var(--destructive)]/20">
            <div>
              <p className="text-[var(--foreground)]">Delete Account</p>
              <p className="text-[var(--muted-foreground)] mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              className="border-[var(--destructive)]/40 text-[var(--destructive)] hover:bg-[var(--destructive)]/20"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
