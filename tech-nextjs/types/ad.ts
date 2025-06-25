export interface Ad {
  id: string;
  FullName: string;
  ad_Url: string;
  Image?: string;
  location :string;
  hit: number,
  status?: 'draft' | 'published'| 'unpublished' | 'pending' | 'rejected';
  start_date: string;
  End_date: string;
}