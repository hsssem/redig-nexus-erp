import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, MoreHorizontal, Filter, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useClients, Client } from '@/hooks/useClients';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, loading, createClient, updateClient, deleteClient } = useClients();
  const { addDeletedItem } = useAppSettings();
  const [newClient, setNewClient] = useState<Partial<Client>>({
    company_name: '',
    manager: '',
    industry: '',
    classification: 'Customer',
    notes: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (client) =>
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.manager && client.manager.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.industry && client.industry.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateClient = async () => {
    if (!newClient.company_name) {
      return;
    }

    const success = await createClient(newClient);
    if (success) {
      setNewClient({
        company_name: '',
        manager: '',
        industry: '',
        classification: 'Customer',
        notes: '',
      });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient || !newClient.company_name) {
      return;
    }

    const success = await updateClient(editingClient.id, newClient);
    if (success) {
      setEditingClient(null);
      setNewClient({
        company_name: '',
        manager: '',
        industry: '',
        classification: 'Customer',
        notes: '',
      });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteClient = async (client: Client) => {
    const success = await deleteClient(client.id);
    if (success) {
      addDeletedItem({
        id: client.id,
        name: client.company_name,
        type: 'customer',
        data: client,
        deletedAt: new Date().toISOString(),
      });
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setNewClient({
      company_name: client.company_name,
      manager: client.manager || '',
      industry: client.industry || '',
      classification: client.classification || 'Customer',
      notes: client.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setNewClient({
      company_name: '',
      manager: '',
      industry: '',
      classification: 'Customer',
      notes: '',
    });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Customers"
        description="Manage your customer relationships"
        action={{
          label: "Add Customer",
          onClick: () => setIsDialogOpen(true),
        }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </PageHeader>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead className="hidden md:table-cell">Industry</TableHead>
              <TableHead className="hidden md:table-cell">Classification</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.company_name}</TableCell>
                  <TableCell>{client.manager || '-'}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {client.industry || '-'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">
                      {client.classification || 'Customer'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(client.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClient(client)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update the customer details.' : 'Create a new customer record. Fill out the details below.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={newClient.company_name}
                  onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Manager</Label>
                <Input
                  id="manager"
                  value={newClient.manager}
                  onChange={(e) => setNewClient({ ...newClient, manager: e.target.value })}
                  placeholder="Manager name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={newClient.industry}
                  onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                  placeholder="Industry"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="classification">Classification</Label>
                <Input
                  id="classification"
                  value={newClient.classification}
                  onChange={(e) => setNewClient({ ...newClient, classification: e.target.value })}
                  placeholder="Classification"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newClient.notes}
                onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button onClick={editingClient ? handleUpdateClient : handleCreateClient}>
              {editingClient ? 'Update Customer' : 'Create Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Customers;
