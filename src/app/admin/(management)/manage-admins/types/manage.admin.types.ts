export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface AdminResponse {
  data: Admin[];
  total: number;
  page: number;
  limit: number;
}