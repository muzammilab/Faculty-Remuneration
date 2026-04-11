const RateList = require("../models/rateList");

exports.getRates = async (req, res) => {
  const config = await RateList.findOne();
  res.json(config);
};

exports.updateRates = async (req, res) => {
  const updated = await RateList.findOneAndUpdate({}, req.body, {
    new: true,
  });
  res.json(updated);
}; 

exports.getRateBasedOnMarks = async (req, res) => {
  try {
    const { subject, faculty , examinerType} = req.body;
    console.log(subject,faculty,examinerType);
    // ⭐ FETCH RATE LIST (ONLY ONCE)
    const config = await RateList.findOne();

    const result = {};

    // TERM WORK
    if (subject.hasTermWork && subject.termWorkMarks) {
      console.log("Calculating term work marks...");
      let rate;
      rate = config.termWork?.[subject.termWorkMarks];
      if (rate) result.termWorkMarks = rate;
    }

    // TERM TEST
    if (subject.hasTermTest && subject.termTestMarks) {
      console.log("Calculating term test marks...");
      let rate;
      rate = config.termTest?.[subject.termTestMarks];
      if (rate) result.termTestMarks = rate;
    }

    // ORAL
    if (subject.hasOral && subject.oralMarks) {
      console.log("Calculating oral marks...");
      let rate;
      if(faculty.role === "faculty"){
        rate = config.oral?.[subject.oralMarks]?.internal;
      }
      else{
        rate = config.oral?.[subject.oralMarks]?.external;
      }
      if (rate) result.oralMarks = rate;
    }

    // PRACTICAL OR ORAL WITH PRACTICAL
    if (subject.hasPractical && subject.practicalMarks) {
      console.log("Calculating oral with practical marks...");
      let rate;
      if(faculty.role === "faculty"){
        rate = config.oralWithPractical?.[subject.practicalMarks]?.internal;
      }
      else{
        rate = config.oralWithPractical?.[subject.practicalMarks]?.external;
      }
      if (rate) result.practicalMarks = rate;
    }

    // SEMESTER
    if (subject.hasSemesterExam && subject.semesterExamMarks) {
      console.log("Calculating semester marks...");
      let marks = subject.semesterExamMarks;

      if (marks === 75) marks = 80; // optional normalization

      let rate;

      if (examinerType?.toLowerCase() === "assessment") {
        rate = config.semester?.assessment?.[marks];
      } else {
        rate = config.semester?.moderation?.[marks];
      }
      if (rate) result.semesterMarks = rate;
    }

    return res.json(result);
    // res.json({ termWorkMarks, termTestMarks, oralMarks, oralWithPracticalMarks, semesterMarks });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Calculation failed" });
  }
};