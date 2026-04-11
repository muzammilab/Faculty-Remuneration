// seedRateConfig.js

const RateList = require("./models/rateList");

const seedRateConfig = async () => {
  try {
    const existing = await RateList.findOne();

    if (!existing) {
      await RateList.create({
        termWork: {
          "25": 6,
          "50": 10,
        },

        oral: {
          "25": {
            internal: 6,
            external: 6,
          },
          "50": {
            internal: 10,
            external: 10,
          },
        },

        oralWithPractical: {
          "25": {
            internal: 10,
            external: 10,
          },
          "50": {
            internal: 20,
            external: 20,
          },
        },

         termTest: {
          "20": 4,
        },

        semester: {
          assessment: {
            "100": 16,
            "80": 16,
            "60": 8,
            "50": 8,
            "40": 8,
          },
          moderation: {
            "100": 20,
            "80": 20,
            "60": 10,
            "50": 10,
            "40": 10,
          },
        },
      });

      console.log("✅ RateList initialized successfully");
    } else {
      console.log("ℹ️ RateList already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding RateList:", error);
  }
};

module.exports = seedRateConfig;