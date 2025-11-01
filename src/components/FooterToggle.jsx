import { useState } from "react";

export function FooterToggle({ onToggle }) {
  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    onToggle(newValue);
  };

  return (
    <div className="flex items-center gap-2" >
      <input
        type="checkbox"
        id="footer-toggle"
        checked={checked}
        onChange={handleChange}
        // className="w-4 h-4"
        style={{
          accentColor: "#dc2626",
          width: "16px",
          marginLeft: "5px",
          height: "16px",
        }}
      />
      <label htmlFor="footer-toggle" className="text-gray-700 font-medium ">
        Include Footer in Report
      </label>
    </div>
  );
}

// ✅ This is what ReportPreview.jsx imports
export function CustomFooter() {
  return (
    <div
      style={{
        borderTop: "2px solid #000",
        marginTop: "20px",
        paddingTop: "10px",
        fontSize: "13px",
        textAlign: "center",
        color: "#111",
        width: "100%",
        backgroundColor: "#fff",
      }}
    >
      <p style={{ margin: 0 }}>
        <strong>Lab Grade :</strong> Basic Composite Laboratory As per GR# 52 CH / 122018 / 1032 / A By MOHFW - Gov. of Gujarat.
      </p>
      <p style={{ margin: 0 }}>
        <strong>Note :</strong> Lab Reports are subject to technical limitations. Clinical correlation is necessary.
      </p>
    </div>
  );
}
