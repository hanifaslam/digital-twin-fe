export type LecturerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export interface Lecturer {
  id: string;
  name: string;
  nip: string;
  status: LecturerStatus;
  is_manual: boolean;
  study_program: string[];
}

export interface LecturerStatusUpdatePayload {
  id: string;
  status: LecturerStatus;
  is_manual: boolean;
}
