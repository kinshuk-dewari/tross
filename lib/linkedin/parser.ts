import type { LinkedInProfile, VoyagerEntity, VoyagerResponse } from "./types";
const str = (v: any): string | null => {
  if (v == null) return null;
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object")
    return typeof v.text === "string"
      ? v.text
      : typeof v.name === "string"
        ? v.name
        : typeof v.defaultLocalizedName === "string"
          ? v.defaultLocalizedName
          : null;
  return null;
};
const mapOf = (r: VoyagerResponse) =>
  new Map(
    (r.included ?? []).filter((x) => x.entityUrn).map((x) => [x.entityUrn!, x]),
  );
const refs = (urn: any, map: Map<string, VoyagerEntity>): VoyagerEntity[] => {
  if (typeof urn !== "string") return [];
  const c = map.get(urn);
  if (!c) return [];
  const a = c["*elements"] ?? c.elements ?? [];
  return Array.isArray(a)
    ? (a
        .map((x: any) =>
          typeof x === "string"
            ? map.get(x)
            : x?.entityUrn
              ? (map.get(x.entityUrn) ?? x)
              : null,
        )
        .filter(Boolean) as VoyagerEntity[])
    : [];
};
const date = (x: any) =>
  x?.year
    ? `${x.year}${x.month ? `-${String(x.month).padStart(2, "0")}` : ""}`
    : null;
const range = (x: any) => ({
  startDate: date(x?.start),
  endDate: date(x?.end),
});

export function parseProfile(r: VoyagerResponse): LinkedInProfile {
  const map = mapOf(r);
  const urn = r.data?.["*elements"]?.[0] ?? r.data?.elements?.[0];
  if (typeof urn !== "string")
    throw new Error("No requested profile URN in response");
  const p = map.get(urn);
  if (!p) throw new Error("Requested profile entity not found");
  const geo =
    typeof p.geoLocation?.geoUrn === "string"
      ? map.get(p.geoLocation.geoUrn)
      : undefined;

  const experience: any[] = [];
  for (const g of refs(p["*profilePositionGroups"], map)) {
    const companyRef =
      typeof g["*company"] === "string" ? map.get(g["*company"]) : undefined;
    for (const pos of refs(g["*profilePositionInPositionGroup"], map)) {
      const d = range(pos.dateRange);
      experience.push({
        title: str(pos.title),
        company:
          str(g.companyName) ?? str(companyRef?.name) ?? str(pos.companyName),
        companyUrl: str(companyRef?.url),
        location: str(pos.locationName),
        startDate: d.startDate,
        endDate: d.endDate,
        description: str(pos.description),
      });
    }
  }

  const education = refs(p["*profileEducations"], map).map((e) => {
    const school =
      typeof e["*school"] === "string" ? map.get(e["*school"]) : undefined;
    const d = range(e.dateRange);
    return {
      school: str(e.schoolName) ?? str(school?.name),
      schoolUrl: str(school?.url),
      degree: str(e.degreeName) ?? str(e.degree),
      fieldOfStudy: str(e.fieldOfStudy),
      startDate: d.startDate,
      endDate: d.endDate,
      description: str(e.description),
    };
  });

  const skills = refs(p["*profileSkills"], map)
    .map((x) => str(x.name) ?? str(x.skillName))
    .filter(Boolean) as string[];
  const certifications = refs(
    p["*profileCertifications"] ?? p["*profileLicensesAndCertifications"],
    map,
  ).map((x) => ({
    name: str(x.name) ?? str(x.licenseName),
    issuer: str(x.authority) ?? str(x.issuer),
    issueDate: date(x.issueDate),
    expirationDate: date(x.expirationDate),
    credentialId: str(x.credentialId),
    credentialUrl: str(x.url) ?? str(x.credentialUrl),
  }));
  const languages = refs(p["*profileLanguages"], map).map((x) => ({
    name: str(x.name) ?? str(x.languageName),
    proficiency: str(x.proficiency) ?? str(x.proficiencyLevel),
  }));

  return {
    id:
      typeof p.entityUrn === "string"
        ? p.entityUrn.replace("urn:li:fsd_profile:", "")
        : null,
    publicIdentifier: str(p.publicIdentifier),
    firstName: str(p.firstName),
    lastName: str(p.lastName),
    name: [str(p.firstName), str(p.lastName)].filter(Boolean).join(" ") || null,
    headline: str(p.headline),
    location: str(p.locationName) ?? str(geo?.defaultLocalizedName),
    about: str(p.summary),
    profileImage: str(p.picture?.rootUrl) ?? str(p.displayPictureUrl),
    experience,
    education,
    skills,
    certifications,
    languages,
  };
}
