import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../utils/api";

const AdminRateConfig = () => {
  const [rates, setRates] = useState(null);

  // 🔹 Fetch rates
  const fetchRates = async () => {
    console.log("Fetching rates...");
    const res = await api.get("http://localhost:3002/admin/rates");
    setRates(res.data);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // 🔹 Handle change
  const handleChange = (path, value) => {
    const updated = { ...rates };

    let ref = updated;
    for (let i = 0; i < path.length - 1; i++) {
      ref = ref[path[i]];
    }
    ref[path[path.length - 1]] = Number(value);

    setRates(updated);
  };

  // 🔹 Save
  const handleSave = async () => {
    await api.put("http://localhost:3002/admin/rates", rates);
    alert("Rates updated successfully ✅");
  };

  if (!rates) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rate Configuration</h1>

      {/* TERM WORK */}
      <Section title="Term Work">
        {Object.entries(rates.termWork).map(([marks, rate]) => (
          <InputRow
            key={marks}
            label={`${marks} Marks`}
            value={rate}
            onChange={(val) =>
              handleChange(["termWork", marks], val)
            }
          />
        ))}
      </Section>

      {/* TERM TEST */}
      <Section title="Term Test">
        {Object.entries(rates.termTest).map(([marks, rate]) => (
          <InputRow
            key={marks}
            label={`${marks} Marks`}
            value={rate}
            onChange={(val) =>
              handleChange(["termTest", marks], val)
            }
          />
        ))}
      </Section>

      {/* ORAL */}
      <Section title="Oral">
        {Object.entries(rates.oral).map(([marks, obj]) => (
          <div key={marks} className="mb-4">
            <h3 className="font-semibold">{marks} Marks</h3>
            <InputRow
              label="Internal"
              value={obj.internal}
              onChange={(val) =>
                handleChange(["oral", marks, "internal"], val)
              }
            />
            <InputRow
              label="External"
              value={obj.external}
              onChange={(val) =>
                handleChange(["oral", marks, "external"], val)
              }
            />
          </div>
        ))}
      </Section>

      {/* ORAL WITH PRACTICAL */}
      <Section title="Oral with Practical">
        {Object.entries(rates.oralWithPractical).map(
          ([marks, obj]) => (
            <div key={marks} className="mb-4">
              <h3 className="font-semibold">{marks} Marks</h3>
              <InputRow
                label="Internal"
                value={obj.internal}
                onChange={(val) =>
                  handleChange(
                    ["oralWithPractical", marks, "internal"],
                    val
                  )
                }
              />
              <InputRow
                label="External"
                value={obj.external}
                onChange={(val) =>
                  handleChange(
                    ["oralWithPractical", marks, "external"],
                    val
                  )
                }
              />
            </div>
          )
        )}
      </Section>

      {/* SEMESTER */}
      <Section title="Semester - Assessment">
        {Object.entries(rates.semester.assessment).map(
          ([marks, rate]) => (
            <InputRow
              key={marks}
              label={`${marks} Marks`}
              value={rate}
              onChange={(val) =>
                handleChange(
                  ["semester", "assessment", marks],
                  val
                )
              }
            />
          )
        )}
      </Section>

      <Section title="Semester - Moderation">
        {Object.entries(rates.semester.moderation).map(
          ([marks, rate]) => (
            <InputRow
              key={marks}
              label={`${marks} Marks`}
              value={rate}
              onChange={(val) =>
                handleChange(
                  ["semester", "moderation", marks],
                  val
                )
              }
            />
          )
        )}
      </Section>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow"
      >
        Save Changes
      </button>
    </div>
  );
};

export default AdminRateConfig;

// 🔹 Reusable Components

const Section = ({ title, children }) => (
  <div className="mb-6 p-4 border rounded-xl shadow-sm">
    <h2 className="text-xl font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

const InputRow = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between mb-2">
    <span>{label}</span>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border px-2 py-1 rounded w-24 text-right"
    />
  </div>
);