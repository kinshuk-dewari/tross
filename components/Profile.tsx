"use client";

import {
  IconBrandLinkedin,
  IconBuilding,
  IconCertificate,
  IconExternalLink,
  IconSchool,
  IconBrandGithub
} from "@tabler/icons-react";

import type {
  LinkedInProfile,
  Experience,
  Education,
  Certification,
} from "@/lib/linkedin/types";

interface ProfileResultProps {
  profile: LinkedInProfile;
  meta?: {
    source?: string;
    publicIdentifier?: string;
  };
}

/* Helpers */

function formatDate(date: string | null) {
  if (!date) return "Present";

  const [year, month] = date.split("-");

  if (!month) return year;

  return new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null) {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/* External Link */

function ExternalLink({
  href,
  icon,
  children,
  prominent = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  prominent?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        prominent
          ? "mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-blue-100 hover:text-gray-700"
          : "mt-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-700"
      }
    >
      {icon}

      <span>{children}</span>

      <IconExternalLink className="h-5 w-5" stroke={2} />
    </a>
  );
}

/* Section */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 py-8 last:border-b-0">
      <h2 className="mb-5 text-xl font-semibold text-gray-900">
        {title}
      </h2>

      {children}
    </section>
  );
}

/* Experience */

function ExperienceItem({
  experience,
  isLast,
}: {
  experience: Experience;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-gray-900" />

        {!isLast && (
          <div className="mt-2 w-px flex-1 bg-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "" : "pb-8"}`}>
        <h3 className="text-lg font-semibold text-gray-900">
          {experience.title || "Unknown role"}
        </h3>

        {experience.company && (
          <p className="mt-1 text-gray-700">
            {experience.company}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          {formatDate(experience.startDate)} —{" "}
          {formatDate(experience.endDate)}
        </p>

        {experience.location && (
          <p className="mt-1 text-sm text-gray-500">
            {experience.location}
          </p>
        )}

        {experience.description && (
          <p className="mt-3 leading-6 text-gray-600">
            {experience.description}
          </p>
        )}

        {experience.companyUrl && (
          <ExternalLink
            href={experience.companyUrl}
            icon={<IconBuilding stroke={2} />}
          >
            View company
          </ExternalLink>
        )}
      </div>
    </div>
  );
}

/* Education */

function EducationItem({
  education,
}: {
  education: Education;
}) {
  return (
    <div className="flex gap-4">
      {/* Institution avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <span className="text-lg font-bold text-gray-600">
          {getInitials(education.school)}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-semibold text-gray-900">
          {education.school || "Unknown institution"}
        </h3>

        {education.degree && (
          <p className="mt-1 text-gray-700">
            {education.degree}
          </p>
        )}

        {education.fieldOfStudy && (
          <p className="text-gray-600">
            {education.fieldOfStudy}
          </p>
        )}

        {(education.startDate || education.endDate) && (
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(education.startDate)} —{" "}
            {formatDate(education.endDate)}
          </p>
        )}

        {education.schoolUrl && (
          <ExternalLink
            href={education.schoolUrl}
            icon={<IconSchool stroke={2} />}
          >
            View institution
          </ExternalLink>
        )}
      </div>
    </div>
  );
}

/* Certification  */

function CertificationItem({
  certification,
}: {
  certification: Certification;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {/* Certificate icon */}
        <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <IconCertificate className="h-10 w-10" stroke={2} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900">
            {certification.name || "Certification"}
          </h3>

          {certification.issuer && (
            <p className="mt-1 text-gray-600">
              Issued by {certification.issuer}
            </p>
          )}
        </div>
      </div>

      {certification.credentialId && (
        <p className="mt-3 text-sm text-gray-500">
          Credential ID: {certification.credentialId}
        </p>
      )}

      {certification.issueDate && (
        <p className="mt-1 text-sm text-gray-500">
          Issued: {formatDate(certification.issueDate)}
        </p>
      )}

      {certification.credentialUrl && (
        <ExternalLink
          href={certification.credentialUrl}
          icon={<IconCertificate stroke={2} />}
        >
          Show credential
        </ExternalLink>
      )}
    </div>
  );
}

/* Profile Result */

export default function Profile({
  profile,
  meta,
}: ProfileResultProps) {
  const initials = getInitials(profile.name);

  return (
    <div className="mx-auto w-full max-w-4xl pt-7">
      {/* Profile Header */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Cover */}
        <div className="h-32 bg-gray-100" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.name || "Profile"}
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-2xl font-semibold text-white shadow-sm">
                {initials}
              </div>
            )}
          </div>

          {/* Profile information */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.name || "Unknown"}
            </h1>

            {profile.headline && (
              <p className="mt-2 text-lg text-gray-700">
                {profile.headline}
              </p>
            )}

            {profile.location && (
              <p className="mt-2 text-sm text-gray-500">
                {profile.location}
              </p>
            )}

            {profile.publicIdentifier && (
              <ExternalLink
                href={`https://www.linkedin.com/in/${profile.publicIdentifier}/`}
                icon={
                  <IconBrandLinkedin
                   
                    stroke={2}
                  />
                }
                prominent
              >
                View LinkedIn profile
              </ExternalLink>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-6">
        {/* About */}
        {profile.about && (
          <Section title="About">
            <p className="whitespace-pre-line leading-7 text-gray-700">
              {profile.about}
            </p>
          </Section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <Section title="Experience">
            <div>
              {profile.experience.map((experience, index) => (
                <ExperienceItem
                  key={`${experience.company}-${experience.title}-${index}`}
                  experience={experience}
                  isLast={
                    index === profile.experience.length - 1
                  }
                />
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <Section title="Education">
            <div className="space-y-7">
              {profile.education.map((education, index) => (
                <EducationItem
                  key={`${education.school}-${index}`}
                  education={education}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <Section title="Certifications">
            <div className="grid gap-4 md:grid-cols-2">
              {profile.certifications.map(
                (certification, index) => (
                  <CertificationItem
                    key={`${certification.name}-${index}`}
                    certification={certification}
                  />
                )
              )}
            </div>
          </Section>
        )}

        {/* Languages */}
        {profile.languages?.length > 0 && (
          <Section title="Languages">
            <div className="grid gap-3 sm:grid-cols-2">
              {profile.languages.map((language, index) => (
                <div
                  key={`${language.name}-${index}`}
                  className="flex justify-between rounded-lg border border-gray-200 p-3"
                >
                  <span className="font-medium text-gray-900">
                    {language.name}
                  </span>

                  {language.proficiency && (
                    <span className="text-sm text-gray-500">
                      {language.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Metadata */}

      <div className="mt-4 flex justify-between px-2 text-xs text-gray-400">
        <a
            href="https://github.com/kinshuk-dewari/tross"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-blue-600"
        >
            <IconBrandGithub size={14} stroke={2} />

            <span>github/kinshuk-dewari</span>

        </a>

        <a
            href="https://www.linkedin.com/in/kinshuk-dewari/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-blue-600"
        >
            <IconBrandLinkedin size={14} stroke={2} />

            <span>linkedin/kinshuk-dewari</span>
        </a>
        </div>
    </div>
  );
}