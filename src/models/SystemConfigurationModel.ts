interface SystemConfiguration {
  id: string;
  companyId: string;
  systemConfigurationType: string;
  synced: boolean;
  mostRecentSyncDateTime: Date | null;
  quickBooksSystemConfiguration_ClientId?: string;
  quickBooksSystemConfiguration_ClientSecret?: string;
  quickBooksSystemConfiguration_RedirectUri?: string;
  quickBooksSystemConfiguration_AccessToken?: string;
  quickBooksSystemConfiguration_RefreshToken?: string;
  quickBooksSystemConfiguration_CompanyId?: string;
  waveSystemConfiguration_ApiKey?: string;
  waveSystemConfiguration_BusinessId?: string;
  waveSystemConfiguration_AccessToken?: string;
  freshBooksSystemConfiguration_ClientId?: string;
  freshBooksSystemConfiguration_ClientSecret?: string;
  freshBooksSystemConfiguration_RedirectUri?: string;
  freshBooksSystemConfiguration_AccessToken?: string;
  freshBooksSystemConfiguration_AccountId?: string;
  atsSystemConfiguration_atsName?: string;
  atsSystemConfiguration_atsApiUrl?: string;
  atsSystemConfiguration_atsApiKey?: string;
}
export default SystemConfiguration;

