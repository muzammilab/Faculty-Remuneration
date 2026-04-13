const RateList = require("../models/rateList");
const Subject = require("../models/subjects");

exports.getRates = async (req, res) => {
  try {
    const rates = await RateList.findOne();

    if (!rates) {
      return res.status(404).json({ message: "No rate config found" });
    }

    res.json(rates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
};

// exports.updateRates = async (req, res) => {
//   try {
//     const updated = await RateList.findOneAndUpdate(
//       {},
//       req.body,
//       {
//         new: true,
//         upsert: true, // create if not exists
//       }
//     );

//     res.json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Update failed" });
//   }
// };

exports.updateRates = async (req, res) => {
  try {
    const updated = await RateList.findOneAndUpdate(
      {},
      req.body, // 🔥 full object from frontend
      {
        new: true,
        upsert: true, // create if not exists
        runValidators: true,
      }
    );

    res.json(updated);
    console.log("Updated rates --> ", updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.getRateBasedOnMarks = async (req, res) => {
  try {
    const { subjectId, faculty , examinerType} = req.body;
    // ⭐ FETCH RATE LIST (ONLY ONCE)
    const config = await RateList.findOne();
    const subject = await Subject.findById(subjectId);
    console.log("Rate config --> ", config);

    const result = {};
    console.log(subjectId, faculty, examinerType, "Subject details --> ", subject);
    // TERM WORK
    if (subject.hasTermWork && subject.termWorkMarks) {
      console.log("Calculating term work marks...");
      let rate;
      rate = config.termWork?.get(String(subject.termWorkMarks));
      if (rate !== undefined) result.termWorkMarks = rate;
    }

    // TERM TEST
    if (subject.hasTermTest && subject.termTestMarks) {
      console.log("Calculating term test marks...");
      let rate;
      rate = config.termTest?.get(String(subject.termTestMarks));
      console.log(rate);
      if (rate !== undefined) result.termTestMarks = rate;
    }

    // ORAL
    if (subject.hasOral && subject.oralMarks) {
      console.log("Calculating oral marks...");
      let rate;
      if(faculty.role === "faculty"){
        rate = config.oral?.get(String(subject.oralMarks))?.internal;
      }
      else{
        rate = config.oral?.get(String(subject.oralMarks))?.external;
      }
      if (rate !== undefined) result.oralMarks = rate;
    }

    // PRACTICAL OR ORAL WITH PRACTICAL
    if (subject.hasPractical && subject.practicalMarks) {
      console.log("Calculating oral with practical marks...");
      let rate;
      if(faculty.role === "faculty"){
        rate = config.oralWithPractical?.get(String(subject.practicalMarks))?.internal;
      }
      else{
        rate = config.oralWithPractical?.get(String(subject.practicalMarks))?.external;
      }
      if (rate !== undefined) result.practicalMarks = rate;
    }

    // SEMESTER
    if (subject.hasSemesterExam && subject.semesterExamMarks) {
      console.log("Calculating semester marks...");
      let marks = subject.semesterExamMarks;

      if (marks === 75) marks = 80; // optional normalization

      let rate;

      if (examinerType?.toLowerCase() === "moderation") {
        rate = config.semester?.moderation?.get(String(marks));
      } else {
        rate = config.semester?.assessment?.get(String(marks));
      }
      if (rate !== undefined) result.semesterMarks = rate;
    }

    return res.json(result);
    // res.json({ termWorkMarks, termTestMarks, oralMarks, oralWithPracticalMarks, semesterMarks });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Calculation failed" });
  }
};













// const RateList = require("../models/rateList");
// const Subject = require("../models/subjects");
// exports.getRates = async (req, res) => {
//   const config = await RateList.findOne();
//   res.json(config);
// };

// exports.updateRates = async (req, res) => {
//   const updated = await RateList.findOneAndUpdate({}, req.body, {
//     new: true,
//   });
//   res.json(updated);
// }; 

// exports.getRateBasedOnMarks = async (req, res) => {
//   try {
//     const { subjectId, faculty , examinerType} = req.body;
//     console.log(subjectId,faculty,examinerType);
//     // ⭐ FETCH RATE LIST (ONLY ONCE)
//     const config = await RateList.findOne();
//     const subject = await Subject.findById(subjectId);
//     console.log("Subject details --> ", subject);

//     const result = {};

//     // TERM WORK
//     if (subject.hasTermWork && subject.termWorkMarks) {
//       console.log("Calculating term work marks...");
//       let rate;
//       rate = config.termWork?.[subject.termWorkMarks];
//       if (rate) result.termWorkMarks = rate;
//     }

//     // TERM TEST
//     if (subject.hasTermTest && subject.termTestMarks) {
//       console.log("Calculating term test marks...");
//       let rate;
//       rate = config.termTest?.[subject.termTestMarks];
//       if (rate) result.termTestMarks = rate;
//     }

//     // ORAL
//     if (subject.hasOral && subject.oralMarks) {
//       console.log("Calculating oral marks...");
//       let rate;
//       if(faculty.role === "faculty"){
//         rate = config.oral?.[subject.oralMarks]?.internal;
//       }
//       else{
//         rate = config.oral?.[subject.oralMarks]?.external;
//       }
//       if (rate) result.oralMarks = rate;
//     }

//     // PRACTICAL OR ORAL WITH PRACTICAL
//     if (subject.hasPractical && subject.practicalMarks) {
//       console.log("Calculating oral with practical marks...");
//       let rate;
//       if(faculty.role === "faculty"){
//         rate = config.oralWithPractical?.[subject.practicalMarks]?.internal;
//       }
//       else{
//         rate = config.oralWithPractical?.[subject.practicalMarks]?.external;
//       }
//       if (rate) result.practicalMarks = rate;
//     }

//     // SEMESTER
//     if (subject.hasSemesterExam && subject.semesterExamMarks) {
//       console.log("Calculating semester marks...");
//       let marks = subject.semesterExamMarks;

//       if (marks === 75) marks = 80; // optional normalization

//       let rate;

//       if (examinerType?.toLowerCase() === "moderation") {
//         rate = config.semester?.moderation?.[marks];
//       } else {
//         rate = config.semester?.assessment?.[marks];
//       }
//       if (rate) result.semesterMarks = rate;
//     }

//     return res.json(result);
//     // res.json({ termWorkMarks, termTestMarks, oralMarks, oralWithPracticalMarks, semesterMarks });

//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "Calculation failed" });
//   }
// };