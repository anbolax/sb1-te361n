import { Fine, Notification } from '../types';

export const mockFines: Fine[] = [
  {
    id: '1',
    date: '2024-03-15',
    amount: 150.00,
    status: 'pending',
    location: 'Main Street 123',
    fullName: 'John Smith',
    reason: 'Parking violation',
    attachments: [
      'https://images.unsplash.com/photo-1590377094904-1d1f23c5d65f?auto=format&fit=crop&q=80&w=800',
    ],
    comments: ['First warning issued'],
  },
  {
    id: '2',
    date: '2024-03-14',
    amount: 250.00,
    status: 'paid',
    location: 'Downtown Plaza',
    fullName: 'Emma Johnson',
    reason: 'Speed limit violation',
    attachments: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
    ],
    comments: ['Paid on time'],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Fine Issued',
    message: 'A new fine has been issued for parking violation',
    date: '2024-03-15',
    read: false,
    type: 'fine',
  },
  {
    id: '2',
    title: 'Payment Successful',
    message: 'Your payment for fine #2 has been processed',
    date: '2024-03-14',
    read: true,
    type: 'payment',
  },
];