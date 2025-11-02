'use client'

import { useEffect, useState } from 'react';
import { Smartphone, Pencil, Trash2, Settings2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { deleteApp, updateAppLiveStatus, updateAppUrl } from '@/app/(protected)/settings/settings.actions';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import NewAppDialog from './NewAppDialog';


interface Project {
  id: string;
  name: string;
  pathSegment: string;
}

interface App {
  id: string;
  name: string;
  url: string;
  isLive: boolean;
  projects: Project[];
}

interface SettingsProps {
  apps: App[];
}

export default function Settings({ apps = [] }: SettingsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const { theme, setTheme } = useTheme();


  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editIsLive, setEditIsLive] = useState(false);
  const [updatingUrl, setUpdatingUrl] = useState(false);
  const [updatingLive, setUpdatingLive] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoaded) setIsLoaded(true);
  }, [isLoaded]);

  const handleEditClick = (app: App) => {
    setSelectedApp(app);
    setEditUrl(app.url);
    setEditIsLive(app.isLive);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (app: App) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUrl = async () => {
    if (!selectedApp) return;

    // Validate URL
    try {
      new URL(editUrl);
    } catch {
      toast.error("Invalid url passed");
      return;
    }

    setUpdatingUrl(true);
    const result = await updateAppUrl(selectedApp.id, editUrl);
    setUpdatingUrl(false);

    if (result.success) {
      toast.error('Application URL has been updated successfully',);
      setEditDialogOpen(false);
    } else {
      toast.error(result.error || 'Failed to update URL');
    }
  };

  const handleUpdateLiveStatus = async () => {
    if (!selectedApp) return;
    setUpdatingLive(true);
    const result = await updateAppLiveStatus(selectedApp.id, editIsLive);
    setUpdatingLive(false);

    if (result.success) {
      toast.success(`Application is now ${editIsLive ? 'live' : 'offline'}`,);
      setEditDialogOpen(false);
    } else {
      toast.error(result.error || 'Failed to update live status',);
    }
  };

  const handleDeleteApp = async () => {
    if (!appToDelete) return;
    setDeleting(true);
    const result = await deleteApp(appToDelete.id);
    setDeleting(false);

    if (result.success) {
      toast.success(
        'Application and all associated data have been deleted',
      );
      setDeleteDialogOpen(false);
    } else {
      toast.error(result.error || 'Failed to delete application',);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground mt-1 text-base lg:text-lg font-medium">
          Manage your applications and preferences
        </p>
      </div>

      {/* Applications Section */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[var(--primary)]/10 p-2 rounded-lg">
            <Smartphone className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <h3 className="text-[var(--foreground)]">Applications</h3>
        </div>

        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {apps.length === 0 ? (
            <div className='mb-3 py-8 flex items-center gap-3 justify-center'>
              <div className="text-center text-[var(--muted-foreground)]">
                No applications found
              </div>
              <NewAppDialog />
            </div>
          ) : (
            apps.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex   max-md:flex-col-reverse max-md:gap-5 items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-[var(--foreground)] font-medium">{app.name}</p>
                      <Badge
                        className={`text-xs  ${app.isLive
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400 px-4'
                          : 'bg-gray-500/20 text-gray-600 dark:text-gray-400 px-2'
                          }`}
                      >
                        {app.isLive ? 'Live' : 'Development'}
                      </Badge>
                    </div>
                    <code className="text-[var(--muted-foreground)] text-sm break-all">
                      {app.url}
                    </code>
                    {app.projects.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[var(--muted-foreground)] text-sm mb-1">
                          Projects ({app.projects.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {app.projects.map((project) => (
                            <span
                              key={project.id}
                              className="text-xs px-2 py-1 bg-[var(--background)] rounded border border-[var(--border)]"
                            >
                              {project.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 -ml-1 md:ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(app)}
                      className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(app)}
                      className="text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Theme Section */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[var(--accent)]/10 p-2 rounded-lg">
            <Settings2 className="w-5 h-5 text-[var(--accent-foreground)]" />
          </div>
          <h3 className="text-[var(--primary)] -ml-2">Theme</h3>
        </div>

        <div className="space-y-6">
          {isLoaded && (
            <div>
              <Label htmlFor="theme" className="text-[var(--muted-foreground)]">
                Appearance
              </Label>
              <Select defaultValue={theme} value={theme} onValueChange={setTheme}>
                <SelectTrigger className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[var(--muted-foreground)] text-sm mt-1">
                Choose your preferred color theme
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Newsletter Section */}
      <Card className="bg-[var(--card)] border border-[var(--border)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="newsletter" className="text-[var(--foreground)] text-base">
              Newsletter Subscription
            </Label>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">
              Receive updates and news when our service starts (Coming soon)
            </p>
          </div>
          <Switch
            id="newsletter"
            checked={newsletter}
            onCheckedChange={setNewsletter}
          />
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[var(--card)] border border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">
              Edit Application
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 pb-4">
              <p className='text-[var(--muted-foreground)] text-sm'>
                Once your application goes live, all connected project forwarding URLs will be automatically overridden to use the live URL specified here.
              </p>
              <div>
                <Label htmlFor="edit-url">
                  Application URL
                </Label>
                <Input
                  id="edit-url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] mt-2"
                  placeholder="https://example.com"
                />
                <Button
                  onClick={handleUpdateUrl}
                  disabled={updatingUrl || editUrl === selectedApp.url}
                  className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] h-10 md:h-12 mt-3 w-full"
                >
                  {updatingUrl ? 'Updating...' : 'Update URL'}
                </Button>
              </div>

              <div className="space-y-3 mt-10">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="edit-live" className="text-[var(--muted-foreground)]">
                      Live Status
                    </Label>
                    <p className="text-[var(--muted-foreground)] text-sm mt-1">
                      {editIsLive
                        ? 'Application is live and accepting requests'
                        : 'Application is currentlty not set to live'}
                    </p>
                  </div>
                  <Switch
                    id="edit-live"
                    checked={editIsLive}
                    onCheckedChange={setEditIsLive}
                  />
                </div>

                {(editIsLive !== selectedApp.isLive) && (selectedApp.projects.length > 0) && (
                  <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
                    <p className="text-[var(--foreground)] text-sm font-medium mb-2">
                      {editIsLive ? 'Enabling' : 'Disabling'} live status will affect:
                    </p>
                    <ul className="text-[var(--muted-foreground)] text-sm space-y-1">
                      {selectedApp.projects.map((project) => (
                        <li key={project.id} className="font-medium">
                          • {project.name}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[var(--muted-foreground)] text-sm mt-2">
                      {editIsLive
                        ? 'All projects will use the URL specified here'
                        : 'All projects will use their forward URL'}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleUpdateLiveStatus}
                  disabled={updatingLive || editIsLive === selectedApp.isLive}
                  className="bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] h-10 md:h-12 w-full"
                >
                  {updatingLive ? 'Updating...' : 'Update Live Status'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[var(--card)] border border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">
              Are you absolutely sure?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription />
          <div>
            {appToDelete && (
              <>
                <div className='-mt-1 text-sm'>
                  <div>
                    This action cannot be undone. This will permanently delete the App
                    &quot;{appToDelete.name}&quot; and all associated projects and request logs.
                  </div>
                </div>
                {
                  (appToDelete.projects.length > 0) ? (
                    <ul className="list-disc list-inside space-y-[1px] pt-2 mb-3">
                      {appToDelete.projects.map((project) => (
                        <li key={project.id}>{project.name}</li>
                      ))}
                    </ul>
                  ) : null
                }
                <div className="py-4 mt-2">
                  <Label htmlFor="delete-confirm">
                    Type <span className="font-bold">delete</span> to confirm your intention
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="delete"
                    className="mt-2"
                    disabled={deleting}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleDeleteApp}
              variant="destructive"
              disabled={deleting || deleteConfirmation.toLowerCase() !== 'delete'}
              className="w-full h-12 flex"
            >
              {deleting ? 'Deleting...' : 'Delete Application'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}