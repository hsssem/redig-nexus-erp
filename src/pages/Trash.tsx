
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

const Trash = () => {
  const { deletedItems, clearTrash, restoreItem } = useAppSettings();
  const { toast } = useToast();

  const getItemTypeLabel = (type: string) => {
    const labels = {
      customer: 'Customer',
      task: 'Task',
      meeting: 'Meeting',
      invoice: 'Invoice',
      project: 'Project',
      team: 'Team Member',
      lead: 'Lead',
      payment: 'Payment'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleRestore = async (id: string, name: string, type: string) => {
    console.log(`Attempting to restore ${type} with ID: ${id}`);
    const success = await restoreItem(id);
    if (success) {
      console.log(`Successfully restored ${type}: ${name}`);
    } else {
      console.error(`Failed to restore ${type}: ${name}`);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Trash"
        description="Items that have been deleted"
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Empty Trash
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all items in the trash. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  clearTrash();
                  toast({
                    title: "Trash Emptied",
                    description: "All items have been permanently deleted.",
                  });
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                Empty Trash
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageHeader>

      {deletedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Trash2 className="h-16 w-16 text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-medium">Trash is empty</h3>
          <p className="text-muted-foreground">Deleted items will appear here</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{getItemTypeLabel(item.type)}</TableCell>
                  <TableCell>{format(new Date(item.deletedAt), 'PPp')}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleRestore(item.id, item.name, item.type)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  );
};

export default Trash;
