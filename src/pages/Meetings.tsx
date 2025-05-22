
import React, { useState } from 'react';
import { Search, Plus, Calendar, X, Clock, Check, AlertCircle } from 'lucide-react';
import { meetings as initialMeetings, Meeting } from '@/services/mockData';
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Meetings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meetingsList, setMeetingsList] = useState<Meeting[]>(initialMeetings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    attendees: [],
    description: '',
    location: '',
    status: 'scheduled'
  });

  // Filter meetings based on search query
  const filteredMeetings = meetingsList.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateMeeting = () => {
    // Basic validation
    if (!newMeeting.title || !newMeeting.date || !newMeeting.startTime || !newMeeting.endTime || !newMeeting.attendees?.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create new meeting
    const meeting: Meeting = {
      ...newMeeting as Meeting,
      id: (meetingsList.length + 1).toString(),
      status: newMeeting.status as 'scheduled' | 'completed' | 'canceled',
      attendees: newMeeting.attendees || [],
    };

    setMeetingsList([meeting, ...meetingsList]);
    setNewMeeting({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      attendees: [],
      description: '',
      location: '',
      status: 'scheduled'
    });
    setIsDialogOpen(false);
    toast.success('Meeting created successfully');
  };

  const handleStatusChange = (meetingId: string, newStatus: 'scheduled' | 'completed' | 'canceled') => {
    setMeetingsList(
      meetingsList.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
      )
    );
    toast.success(`Meeting status changed to ${newStatus}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Canceled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'canceled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Meetings"
        description="Schedule and manage your meetings"
        action={{
          label: "Schedule Meeting",
          onClick: () => setIsDialogOpen(true),
        }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meetings..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="rounded-md border futuristic-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">Status</TableHead>
              <TableHead>Meeting</TableHead>
              <TableHead className="hidden md:table-cell">Date & Time</TableHead>
              <TableHead className="hidden md:table-cell">Attendees</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    {getStatusIcon(meeting.status)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meeting.title}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {meeting.description && meeting.description.length > 60
                          ? `${meeting.description.substring(0, 60)}...`
                          : meeting.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{format(new Date(meeting.date), 'MMM d, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">
                      {meeting.startTime} - {meeting.endTime}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {meeting.attendees.slice(0, 2).map((attendee, idx) => (
                        <span key={idx} className="text-sm">{attendee}{idx < Math.min(1, meeting.attendees.length - 1) ? ', ' : ''}</span>
                      ))}
                      {meeting.attendees.length > 2 && (
                        <span className="text-sm text-muted-foreground">+{meeting.attendees.length - 2} more</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {meeting.location || 'Not specified'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit meeting</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(meeting.id, 'completed')}
                          disabled={meeting.status === 'completed'}
                        >
                          Mark as completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(meeting.id, 'canceled')}
                          disabled={meeting.status === 'canceled'}
                        >
                          Cancel meeting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No meetings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Fill in the details below to schedule a new meeting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                placeholder="Enter meeting title"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newMeeting.startTime}
                  onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newMeeting.endTime}
                  onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={newMeeting.attendees?.join(', ') || ''}
                onChange={(e) => setNewMeeting({ 
                  ...newMeeting, 
                  attendees: e.target.value.split(',').map(a => a.trim()).filter(Boolean) 
                })}
                placeholder="Enter attendees separated by commas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                placeholder="Meeting description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Meetings;
