import Student from "../models/student.js";

export async function index(req, res) {
  const { q, status, batch } = req.query;
  const filter = {};
  if (q)
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { rollNumber: { $regex: q, $options: "i" } },
      { college: { $regex: q, $options: "i" } },
    ];
  if (status) filter.status = status;
  if (batch) filter.batch = batch;

  const students = await Student.find(filter)
    .sort({ createdAt: -1 })
    .limit(500);
  res.render("students/index", {
    title: "Students",
    students,
    query: { q, status, batch },
  });
}

export async function getNew(req, res) {
  res.render("students/new", { title: "Add Student" });
}

export async function create(req, res) {
  try {
    const { name, rollNumber, college, batch, status, dsa, webd, react } =
      req.body;
    await Student.create({
      name,
      rollNumber,
      college,
      batch,
      status,
      scores: {
        dsa: Number(dsa) || 0,
        webd: Number(webd) || 0,
        react: Number(react) || 0,
      },
    });
    req.flash("success", "Student added");
    res.redirect("/students");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to add student (roll number must be unique)");
    res.redirect("/students/new");
  }
}

export async function getEdit(req, res) {
  const student = await Student.findById(req.params.id);
  if (!student) {
    req.flash("error", "Student not found");
    return res.redirect("/students");
  }
  res.render("students/edit", { title: "Edit Student", student });
}

export async function update(req, res) {
  try {
    const { name, rollNumber, college, batch, status, dsa, webd, react } =
      req.body;
    await Student.findByIdAndUpdate(req.params.id, {
      name,
      rollNumber,
      college,
      batch,
      status,
      scores: {
        dsa: Number(dsa) || 0,
        webd: Number(webd) || 0,
        react: Number(react) || 0,
      },
    });
    req.flash("success", "Student updated");
    res.redirect("/students");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to update student");
    res.redirect(`/students/${req.params.id}/edit`);
  }
}

export async function destroy(req, res) {
  try {
    await Student.findByIdAndDelete(req.params.id);
    req.flash("success", "Student deleted");
    res.redirect("/students");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to delete student");
    res.redirect("/students");
  }
}
