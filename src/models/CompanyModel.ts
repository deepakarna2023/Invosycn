import Person from "./PersonModel";
import SystemConfiguration from "./SystemConfigurationModel";

interface CompanySetting {
  id: string;
  companyName?: string | null;
  image?: string;
  logo?: string;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  personDetails?: Person;
  systemConfiguration?: SystemConfiguration;
  [key: string]: any;
}
export default CompanySetting;


