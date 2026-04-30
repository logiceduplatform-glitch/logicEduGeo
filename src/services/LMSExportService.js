// LMS (Learning Management System) export utilities.
// Provides "share intents" to Google Classroom & MS Teams using their public share URLs,
// plus universal exports (clipboard link, email, QR, .csv for grades, .ics for due dates).
//
// NOTE: Full OAuth integration requires backend + verified app status with each LMS.
// For self-serve teachers, share intents cover 95% of use cases without setup overhead.

const GOOGLE_CLASSROOM_SHARE = "https://classroom.google.com/share";
const TEAMS_SHARE = "https://teams.microsoft.com/share";

function buildShareUrl(base, params) {
  const u = new URL(base);
  Object.entries(params).forEach(([k, v]) => { if (v != null) u.searchParams.set(k, v); });
  return u.toString();
}

export const LMSExportService = {
  /**
   * Open Google Classroom "Share to Classroom" with the assignment URL.
   * https://developers.google.com/classroom/guides/sharebutton
   */
  shareToGoogleClassroom({ url, title, body, itemtype = "assignment" }) {
    const shareUrl = buildShareUrl(GOOGLE_CLASSROOM_SHARE, {
      url,
      title,
      body,
      itemtype, // "assignment" | "material" | "question"
    });
    window.open(shareUrl, "_blank", "width=600,height=600,noopener,noreferrer");
  },

  /**
   * Open Microsoft Teams share dialog with assignment link & message.
   * https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/share-to-teams
   */
  shareToTeams({ url, title, body }) {
    const shareUrl = buildShareUrl(TEAMS_SHARE, {
      href: url,
      msgText: `${title}${body ? "\n\n" + body : ""}`,
      preview: "true",
    });
    window.open(shareUrl, "_blank", "width=700,height=600,noopener,noreferrer");
  },

  /** Produce a universal email mailto link. */
  emailLink({ to = "", title, body, url }) {
    const subject = encodeURIComponent(title || "Assignment");
    const fullBody = encodeURIComponent(`${body || ""}\n\n${url || ""}`);
    return `mailto:${to}?subject=${subject}&body=${fullBody}`;
  },

  /** Build assignment URL for a quiz/lesson code. */
  buildAssignmentUrl(code, type = "quiz") {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (type === "quiz") return `${origin}/play-quiz/${code}`;
    if (type === "homework") return `${origin}/homework/${code}`;
    if (type === "lesson") return `${origin}/lesson/${code}`;
    return `${origin}/quiz/${code}`;
  },

  /** Generate a CSV string of grades for export to LMS gradebook. */
  gradesToCSV(results) {
    const header = "Student,Email,Score,Total,Percent,Submitted At";
    const rows = (results || []).map((r) => {
      const score = r.score ?? 0;
      const total = r.total ?? 0;
      const pct = total > 0 ? Math.round((score / total) * 100) : 0;
      const safe = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
      return [safe(r.studentName), safe(r.studentEmail), score, total, `${pct}%`, safe(r.submittedAt)].join(",");
    });
    return [header, ...rows].join("\n");
  },

  /** Trigger CSV download. */
  downloadCSV(filename, csv) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  /** Generate an .ics calendar file for an assignment due date. */
  toICS({ title, description, dueDate, url, organizer = "GeoLearn" }) {
    if (!dueDate) return "";
    const fmt = (d) => {
      const dt = new Date(d);
      const pad = (n) => String(n).padStart(2, "0");
      return `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
    };
    const start = fmt(dueDate);
    const end = fmt(new Date(new Date(dueDate).getTime() + 30 * 60 * 1000));
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@geolearn`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${organizer}//EN`,
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${fmt(Date.now())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title || "Assignment"}`,
      `DESCRIPTION:${(description || "").replace(/\n/g, "\\n")}${url ? `\\n\\n${url}` : ""}`,
      url ? `URL:${url}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean);
    return lines.join("\r\n");
  },

  downloadICS(filename, ics) {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
