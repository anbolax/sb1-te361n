export interface Fine {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  location: string;
  fullName: string;
  reason: string;
  attachments: string[];
  comments: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'fine' | 'system' | 'payment';
}

export interface Object {
  id: number;
  ext_uuid: string;
  code: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  meta: {
    per_page: number;
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    total: number;
  };
  data: T[];
}

export interface Executor {
  id: string;
  fullName: string;
  sum: string;
  reason: string;
  comment: string;
  files: FileWithComment[];
}

export interface FileWithComment {
  file: File;
  comment: string;
  tempId: string;
  executorId: string;
}

export interface ExecutorFormData {
  fullName: string;
  sum: string;
  reason: string;
  date: string;
  objectId: string;
  executors: Executor[];
}