import Allocation from "../models/allocation.js";

export async function allocate(req, res) {
  const { interviewId } = req.params;
  let { studentIds } = req.body;

  // Normalize to array
  if (!Array.isArray(studentIds)) {
    if (typeof studentIds === "string" && studentIds.trim() !== "")
      studentIds = [studentIds];
    else studentIds = [];
  }

  if (studentIds.length === 0) {
    req.flash("error", "Select at least one student");
    return res.redirect(`/interviews/${interviewId}`);
  }

  try {
    let created = 0;
    for (const sid of studentIds) {
      try {
        await Allocation.create({
          studentId: sid,
          interviewId,
          result: "Didn't Attempt",
        });
        created += 1;
      } catch (e) {
        // Ignore duplicate key errors
        if (!(e && e.code === 11000)) {
          console.error("Allocation create error:", e);
        }
      }
    }
    if (created > 0) req.flash("success", `Allocated ${created} student(s)`);
    else
      req.flash(
        "error",
        "No new allocations (these students were already allocated)"
      );
    res.redirect(`/interviews/${interviewId}`);
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to allocate students");
    res.redirect(`/interviews/${interviewId}`);
  }
}

export async function updateResult(req, res) {
  const { id } = req.params; // allocation id
  const { result } = req.body;
  try {
    await Allocation.findByIdAndUpdate(id, { result });
    req.flash("success", "Result updated");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to update result");
  }
  const referer = req.header("Referer") || "/interviews";
  res.redirect(referer);
}

export async function remove(req, res) {
  const { id } = req.params; // allocation id
  try {
    await Allocation.findByIdAndDelete(id);
    req.flash("success", "Allocation removed");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to remove allocation");
  }
  const referer = req.header("Referer") || "/interviews";
  res.redirect(referer);
}
