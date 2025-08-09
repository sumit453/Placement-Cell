import Allocation from "../models/allocation.js";
import { createCsvStream } from "../utils/csv.js";
import { toYMD } from "../utils/date.js";

export async function downloadCSV(req, res) {
  // Required columns (exactly as in your assignment)
  const headers = [
    "Student id",
    "student name",
    "student college",
    "student status",
    "DSA Final Score",
    "WebD Final Score",
    "React Final Score",
    "interview date",
    "interview company",
    "interview student result",
  ];

  // Set response headers before streaming
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="placements_export_${toYMD(new Date())}.csv"`
  );

  // Create CSV stream and pipe to response
  const csvStream = createCsvStream(headers);
  csvStream.pipe(res);

  try {
    // Stream allocations, populate only needed fields, and use lean for speed
    const cursor = Allocation.find({})
      .populate({ path: "studentId", select: "name college status scores" })
      .populate({ path: "interviewId", select: "company date" })
      .lean()
      .cursor();

    cursor.on("data", (alloc) => {
      const s = alloc.studentId || {};
      const i = alloc.interviewId || {};
      csvStream.write({
        "Student id": s._id ? String(s._id) : "",
        "student name": s.name || "",
        "student college": s.college || "",
        "student status": s.status || "",
        "DSA Final Score": s.scores?.dsa ?? "",
        "WebD Final Score": s.scores?.webd ?? "",
        "React Final Score": s.scores?.react ?? "",
        "interview date": i?.date ? toYMD(i.date) : "",
        "interview company": i?.company || "",
        "interview student result": alloc.result || "",
      });
    });

    cursor.on("end", () => {
      // Always end stream so browser completes download
      csvStream.end();
    });

    cursor.on("error", (err) => {
      console.error("CSV export cursor error:", err);
      try {
        csvStream.end();
      } catch {}
    });
  } catch (e) {
    console.error("CSV export error:", e);
    try {
      csvStream.end();
    } catch {}
  }
}
