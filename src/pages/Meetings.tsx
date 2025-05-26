
import React, { useState } from 'react';
import { Search, Clock, Check, AlertCircle, X } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TranslatedText from '@/components/language/TranslatedText';
import { useTranslation } from '@/hooks/useTranslation';
import { useMeetings, Meeting } from '@/hooks/useMeetings';
import { useToast } from '@/hooks/use-toast';

const Meetings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    subject: '',
    meeting_date: '',
    start_time: '',
    end_time: '',
    participants: [],
    notes: '',
    location: '',
    status: 'scheduled'
  });

  const { meetings, loading, createMeeting, updateMeeting, deleteMeeting } = useMeetings();
  const { toast } = useToast();

  const { translatedText: searchPlaceholder } = useTranslation('Search meetings...');
  const { translatedText: scheduleMeetingText } = useTranslation('Schedule Meeting');
  const { translatedText: noMeetingsText } = useTranslation('No meetings found.');

  // Filter meetings based on search query
  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (meeting.notes?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateMeeting = async () => {
    // Basic validation
    if (!newMeeting.subject || !newMeeting.meeting_date || !newMeeting.start_time || !newMeeting.end_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const participantsArray = typeof newMeeting.participants === 'string' 
      ? newMeeting.participants.split(',').map(p => p.trim()).filter(Boolean)
      : newMeeting.participants || [];

    const success = await createMeeting({
      ...newMeeting,
      participants: participantsArray
    });

    if (success) {
      setNewMeeting({
        subject: '',
        meeting_date: '',
        start_time: '',
        end_time: '',
        participants: [],
        notes: '',
        location: '',
        status: 'scheduled'
      });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateMeeting = async () => {
    if (!editingMeeting) return;

    const participantsArray = typeof newMeeting.participants === 'string' 
      ? newMeeting.participants.split(',').map(p => p.trim()).filter(Boolean)
      : newMeeting.participants || [];

    const success = await updateMeeting(editingMeeting.id, {
      ...newMeeting,
      participants: participantsArray
    });

    if (success) {
      setEditingMeeting(null);
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const handleStatusChange = async (meetingId: string, newStatus: 'scheduled' | 'completed' | 'canceled') => {
    await updateMeeting(meetingId, { status: newStatus });
  };

  const handleDeleteMeeting = async (id: string) => {
    await deleteMeeting(id);
  };

  const openEditDialog = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setNewMeeting({
      subject: meeting.subject,
      meeting_date: meeting.meeting_date,
      start_time: meeting.start_time,
      end_time: meeting.end_time,
      participants: meeting.participants,
      notes: meeting.notes || '',
      location: meeting.location || '',
      status: meeting.status
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewMeeting({
      subject: '',
      meeting_date: '',
      start_time: '',
      end_time: '',
      participants: [],
      notes: '',
      location: '',
      status: 'scheduled'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <TranslatedText text="Scheduled" />
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <TranslatedText text="Completed" />
        </Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <TranslatedText text="Canceled" />
        </Badge>;
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

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">Loading meetings...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Meetings"
        description="Schedule and manage your meetings"
        action={{
          label: scheduleMeetingText,
          onClick: () => {
            resetForm();
            setEditingMeeting(null);
            setIsDialogOpen(true);
          },
        }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
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
              <TableHead className="w-[30px]">
                <TranslatedText text="Status" />
              </TableHead>
              <TableHead>
                <TranslatedText text="Meeting" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <TranslatedText text="Date & Time" />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <TranslatedText text="Participants" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <TranslatedText text="Location" />
              </TableHead>
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
                      <div className="font-medium">{meeting.subject}</div>
                      <div className="text-sm text-muted-foreground hidden sm:block">
                        {meeting.notes && meeting.notes.length > 60
                          ? `${meeting.notes.substring(0, 60)}...`
                          : meeting.notes}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{format(new Date(meeting.meeting_date), 'MMM d, yyyy')}</div>
                    <div className="text-sm text-muted-foreground">
                      {meeting.start_time} - {meeting.end_time}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {meeting.participants.slice(0, 2).map((participant, idx) => (
                        <span key={idx} className="text-sm">{participant}{idx < Math.min(1, meeting.participants.length - 1) ? ', ' : ''}</span>
                      ))}
                      {meeting.participants.length > 2 && (
                        <span className="text-sm text-muted-foreground">+{meeting.participants.length - 2} more</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {meeting.location || <TranslatedText text="Not specified" />}
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
                        <DropdownMenuItem onClick={() => openEditDialog(meeting)}>
                          <TranslatedText text="Edit meeting" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(meeting.id, 'completed')}
                          disabled={meeting.status === 'completed'}
                        >
                          <TranslatedText text="Mark as completed" />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(meeting.id, 'canceled')}
                          disabled={meeting.status === 'canceled'}
                        >
                          <TranslatedText text="Cancel meeting" />
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="text-red-600"
                        >
                          <TranslatedText text="Delete meeting" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {noMeetingsText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              <TranslatedText text={editingMeeting ? "Edit Meeting" : "Schedule New Meeting"} />
            </DialogTitle>
            <DialogDescription>
              <TranslatedText text="Fill in the details below to schedule a new meeting." />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">
                <TranslatedText text="Meeting Subject" />
              </Label>
              <Input
                id="subject"
                value={newMeeting.subject}
                onChange={(e) => setNewMeeting({ ...newMeeting, subject: e.target.value })}
                placeholder="Enter meeting subject"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting_date">
                  <TranslatedText text="Date" />
                </Label>
                <Input
                  id="meeting_date"
                  type="date"
                  value={newMeeting.meeting_date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meeting_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">
                  <TranslatedText text="Location" />
                </Label>
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
                <Label htmlFor="start_time">
                  <TranslatedText text="Start Time" />
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={newMeeting.start_time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">
                  <TranslatedText text="End Time" />
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={newMeeting.end_time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, end_time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">
                <TranslatedText text="Participants" />
              </Label>
              <Input
                id="participants"
                value={Array.isArray(newMeeting.participants) ? newMeeting.participants.join(', ') : newMeeting.participants || ''}
                onChange={(e) => setNewMeeting({ 
                  ...newMeeting, 
                  participants: e.target.value
                })}
                placeholder="Enter participants separated by commas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">
                <TranslatedText text="Notes" />
              </Label>
              <Textarea
                id="notes"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                placeholder="Meeting notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <TranslatedText text="Cancel" />
            </Button>
            <Button onClick={editingMeeting ? handleUpdateMeeting : handleCreateMeeting}>
              <TranslatedText text={editingMeeting ? "Update Meeting" : "Schedule Meeting"} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default Meetings;
