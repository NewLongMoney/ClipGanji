export interface ClipperStats {
  weeklyViews: number;
  weeklyEarnings: number;
  earningsChange: number;
  activeCampaignsCount: number;
  totalSubmissions: number;
  pendingCount: number;
}

export interface ActiveCampaign {
  id: string;
  brand: string;
  category: string;
  accentColor: string;
  deadline: string;
  payPer1k: number;
  myViews: number;
  myEarnings: number;
  clipsSubmitted: number;
  clipsApproved: number;
}

export interface RecentSubmission {
  id: string;
  campaign: string;
  platform: string;
  views: number;
  earnings: number | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string | Date;
}

export interface ClipperProfile {
  fullName: string | null;
  status: string;
  totalEarnings: number;
  totalViews: number;
}

export interface Submission {
  id: string;
  campaign: {
    brandPublic: string;
  };
  platform: string;
  views: number;
  earnings: number | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string | Date;
  postUrl: string | null;
}

export interface DashboardData {
  profile: ClipperProfile;
  stats: ClipperStats;
  activeCampaigns: ActiveCampaign[];
  recentSubmissions: RecentSubmission[];
}
