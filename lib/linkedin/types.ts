export interface ProfileRequest {
  url: string;
}

/* Experience */

export interface Experience {
  title: string | null;
  company: string | null;
  companyUrl: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

/* Education  */

export interface Education {
  school: string | null;
  schoolUrl: string | null;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

/* Certification */

export interface Certification {
  name: string | null;
  issuer: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
}

/* Language */

export interface Language {
  name: string;
  proficiency: string | null;
}

/* LinkedIn Profile */

export interface LinkedInProfile {
  id: string;
  publicIdentifier: string;
  firstName: string;
  lastName: string;
  name: string;
  headline: string | null;
  location: string | null;
  about: string | null;
  profileImage: string | null;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  url: string;
}

/* API Response */

export interface LinkedInProfileResponse {
  profile: LinkedInProfile;
  meta: {
    source: string;
    publicIdentifier: string;
  };
}

/* LinkedIn Voyager Types */

export interface VoyagerEntity {
  entityUrn?: string;

  [key: string]: unknown;
}

export interface VoyagerResponse {
  data?: VoyagerEntity;
  included?: VoyagerEntity[];
}