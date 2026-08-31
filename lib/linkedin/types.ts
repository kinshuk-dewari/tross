export type VoyagerEntity = Record<string, any> & {
  entityUrn?: string;
  $type?: string;
};
export interface VoyagerResponse {
  data?: Record<string, any>;
  included?: VoyagerEntity[];
  [key: string]: any;
}
export interface LinkedInProfile {
  id: string | null;
  publicIdentifier: string | null;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  location: string | null;
  about: string | null;
  profileImage: string | null;
  experience: any[];
  education: any[];
  skills: string[];
  certifications: any[];
  languages: any[];
}
