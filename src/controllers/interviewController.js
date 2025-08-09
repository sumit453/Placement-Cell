import Interview from "../models/interview.js";
import Student from "../models/student.js";
import Allocation from "../models/allocation.js";

export async function index(req, res) {
  const interviews = await Interview.find().sort({ date: -1 });
  res.render("interviews/index", { title: "Interviews", interviews });
}

export async function getNew(req, res) {
  res.render("interviews/new", { title: "Create Interview" });
}

export async function create(req, res) {
  try {
    const { company, date } = req.body;
    await Interview.create({ company, date: new Date(date) });
    req.flash("success", "Interview created");
    res.redirect("/interviews");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to create interview");
    res.redirect("/interviews/new");
  }
}

export async function show(req, res) {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    req.flash("error", "Interview not found");
    return res.redirect("/interviews");
  }
  const allocations = await Allocation.find({ interviewId: interview._id })
    .populate("studentId")
    .sort({ createdAt: -1 });
  const students = await Student.find().sort({ name: 1 });
  res.render("interviews/show", {
    title: `Interview: ${interview.company}`,
    interview,
    students,
    allocations,
  });
}
