export interface Settings {
  general: {
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    defaultLanguage: string;
    emailNotifications: boolean;
    systemEmails: {
      from: string;
      replyTo: string;
    };
  };
  appearance: {
    branding: {
      logo: string;
      appName: string;
      favicon: string;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      headerBg: string;
      sidebarBg: string;
      textPrimary: string;
      textSecondary: string;
    };
  };
  views: {
    defaultViews: {
      projects: 'grid' | 'list';
      users: 'grid' | 'list';
      convocatorias: 'grid' | 'list';
    };
    displayOptions: {
      showDescription: boolean;
      showMetadata: boolean;
      showThumbnails: boolean;
      itemsPerPage: number;
    };
    dashboardLayout: {
      showStats: boolean;
      showRecentActivity: boolean;
      showUpcomingDeadlines: boolean;
      showQuickActions: boolean;
    };
  };
  reviews: {
    allowAdminReview: boolean;
    allowCoordinatorReview: boolean;
  };
  help: {
    enabled: boolean;
    helpUrls: {
      admin: string;
      coordinator: string;
      presenter: string;
      reviewer: string;
      guest: string;
    };
  };
  legal: {
    termsAndConditions: {
      content: string;
      lastUpdated: string;
    };
    privacyPolicy: {
      content: string;
      lastUpdated: string;
    };
  };
}