import type {
  LinkedInProfile,
  VoyagerEntity,
  VoyagerResponse,
} from "./types";

/* Helpers */

const str = (value: unknown): string | null => {
  if (value == null) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const object = value as Record<string, unknown>;

    if (typeof object.text === "string") {
      return object.text;
    }

    if (typeof object.name === "string") {
      return object.name;
    }

    if (typeof object.defaultLocalizedName === "string") {
      return object.defaultLocalizedName;
    }
  }

  return null;
};

/* Create entity lookup map */

const mapOf = (
  response: VoyagerResponse,
): Map<string, VoyagerEntity> => {
  return new Map(
    (response.included ?? [])
      .filter(
        (entity): entity is VoyagerEntity =>
          typeof entity.entityUrn === "string",
      )
      .map((entity) => [
        entity.entityUrn as string,
        entity,
      ]),
  );
};

/* Resolve referenced entities */

const refs = (
  urn: unknown,
  map: Map<string, VoyagerEntity>,
): VoyagerEntity[] => {
  if (typeof urn !== "string") {
    return [];
  }

  const entity = map.get(urn);

  if (!entity) {
    return [];
  }

  const elements =
    entity["*elements"] ??
    entity.elements ??
    [];

  if (!Array.isArray(elements)) {
    return [];
  }

  return elements
    .map((item): VoyagerEntity | null => {

      if (typeof item === "string") {
        return map.get(item) ?? null;
      }

      if (
        typeof item === "object" &&
        item !== null
      ) {
        const object =
          item as Record<string, unknown>;

        if (
          typeof object.entityUrn === "string"
        ) {
          return (
            map.get(object.entityUrn) ??
            (object as VoyagerEntity)
          );
        }
      }

      return null;
    })
    .filter(
      (item): item is VoyagerEntity =>
        item !== null,
    );
};

/* Parse LinkedIn date */

const date = (
  value: unknown,
): string | null => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return null;
  }

  const object =
    value as Record<string, unknown>;

  const year = object.year;
  const month = object.month;

  if (typeof year !== "number") {
    return null;
  }

  if (typeof month === "number") {
    return `${year}-${String(month).padStart(
      2,
      "0",
    )}`;
  }

  return String(year);
};

/* Parse date range */

const range = (
  value: unknown,
): {
  startDate: string | null;
  endDate: string | null;
} => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return {
      startDate: null,
      endDate: null,
    };
  }

  const object =
    value as Record<string, unknown>;

  return {
    startDate: date(object.start),
    endDate: date(object.end),
  };
};

/* Parser */

export function parseProfile(
  response: VoyagerResponse,
): LinkedInProfile {
  const map = mapOf(response);

  const data = response.data;

  if (!data) {
    throw new Error(
      "No profile data in response",
    );
  }

  /* Find requested profile URN  */

  const elements =
    data["*elements"] ??
    data.elements;

  if (!Array.isArray(elements)) {
    throw new Error(
      "No requested profile URN in response",
    );
  }

  const urn = elements[0];

  if (typeof urn !== "string") {
    throw new Error(
      "No requested profile URN in response",
    );
  }

  const profile = map.get(urn);

  if (!profile) {
    throw new Error(
      "Requested profile entity not found",
    );
  }

  /* Location */

  let geo: VoyagerEntity | undefined;

  const geoLocation =
    profile.geoLocation;

  if (
    typeof geoLocation === "object" &&
    geoLocation !== null
  ) {
    const geoObject =
      geoLocation as Record<
        string,
        unknown
      >;

    if (
      typeof geoObject.geoUrn === "string"
    ) {
      geo = map.get(
        geoObject.geoUrn,
      );
    }
  }

  /* Experience */

  const experience: LinkedInProfile["experience"] =
    [];

  for (const group of refs(
    profile["*profilePositionGroups"],
    map,
  )) {
    let companyRef:
      | VoyagerEntity
      | undefined;

    if (
      typeof group["*company"] ===
      "string"
    ) {
      companyRef = map.get(
        group["*company"] as string,
      );
    }

    for (const position of refs(
      group[
        "*profilePositionInPositionGroup"
      ],
      map,
    )) {
      const dates = range(
        position.dateRange,
      );

      experience.push({
        title:
          str(position.title) ?? "",

        company:
          str(group.companyName) ??
          str(companyRef?.name) ??
          str(position.companyName) ??
          "",

        companyUrl:
          str(companyRef?.url) ?? "",

        location:
          str(position.locationName) ?? "",

        startDate: dates.startDate,

        endDate: dates.endDate,

        description:
          str(position.description) ?? "",
      });
    }
  }

  /* Education  */

  const education =
    refs(
      profile["*profileEducations"],
      map,
    ).map((item) => {
      let schoolRef:
        | VoyagerEntity
        | undefined;

      if (
        typeof item["*school"] ===
        "string"
      ) {
        schoolRef = map.get(
          item["*school"] as string,
        );
      }

      const dates = range(
        item.dateRange,
      );

      return {
        school:
          str(item.schoolName) ??
          str(schoolRef?.name) ??
          "",

        schoolUrl:
          str(schoolRef?.url) ?? "",

        degree:
          str(item.degreeName) ??
          str(item.degree) ??
          "",

        fieldOfStudy:
          str(item.fieldOfStudy) ?? "",

        startDate: dates.startDate,

        endDate: dates.endDate,

        description:
          str(item.description) ?? "",
      };
    });

  /* Skills */

  const skills = refs(
    profile["*profileSkills"],
    map,
  )
    .map(
      (item) =>
        str(item.name) ??
        str(item.skillName),
    )
    .filter(
      (skill): skill is string =>
        Boolean(skill),
    );

  /* Certifications */

  const certifications = refs(
    profile["*profileCertifications"] ??
      profile[
        "*profileLicensesAndCertifications"
      ],
    map,
  ).map((item) => ({
    name:
      str(item.name) ??
      str(item.licenseName) ??
      "",

    issuer:
      str(item.authority) ??
      str(item.issuer) ??
      "",

    issueDate:
      date(item.issueDate),

    expirationDate:
      date(item.expirationDate),

    credentialId:
      str(item.credentialId) ?? "",

    credentialUrl:
      str(item.url) ??
      str(item.credentialUrl) ??
      "",
  }));

  /* Languages */

  const languages = refs(
    profile["*profileLanguages"],
    map,
  ).map((item) => ({
    name:
      str(item.name) ??
      str(item.languageName) ??
      "",

    proficiency:
      str(item.proficiency) ??
      str(item.proficiencyLevel) ??
      "",
  }));

  /*  Name  */

  const firstName =
    str(profile.firstName) ?? "";

  const lastName =
    str(profile.lastName) ?? "";

  const name =
    [firstName, lastName]
      .filter(Boolean)
      .join(" ") || "Unknown";

  /* Profile Image */

  let profileImage = "";

  const picture =
    profile.picture;

  if (
    typeof picture === "object" &&
    picture !== null
  ) {
    const pictureObject =
      picture as Record<
        string,
        unknown
      >;

    profileImage =
      str(pictureObject.rootUrl) ?? "";
  }

  if (!profileImage) {
    profileImage =
      str(
        profile.displayPictureUrl,
      ) ?? "";
  }

  /* Profile URL */

  const publicIdentifier =
    str(
      profile.publicIdentifier,
    ) ?? "";

  const profileUrl =
    publicIdentifier
      ? `https://www.linkedin.com/in/${publicIdentifier}/`
      : "";

  /* Return normalized profile */

  return {
    id:
      typeof profile.entityUrn ===
      "string"
        ? profile.entityUrn.replace(
            "urn:li:fsd_profile:",
            "",
          )
        : "",

    publicIdentifier,firstName,lastName,name,

    headline:
      str(profile.headline) ?? "",

    location:
      str(profile.locationName) ??
      str(
        geo?.defaultLocalizedName,
      ) ??
      "",

    about:
      str(profile.summary) ?? "",

    profileImage,experience,education,skills,certifications,languages,

    url:
      str(profile.url) ??
      profileUrl,
  };
}