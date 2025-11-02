import { useState } from "react";
import PatientInfo from "./components/PatientInfo";
import TestEntry from "./components/TestEntry";
import ReportPreview from "./components/ReportPreview";
import HeaderToggle from "./components/HeaderToggle";
import { FooterToggle } from "./components/FooterToggle";


function App() {
  const [patientData, setPatientData] = useState(null);
  const [tests, setTests] = useState([]);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveInfo = (info) => setPatientData(info);
  const handleSaveReport = (testList, selectedReportName) => {
    setTests(testList);
    setReportName(selectedReportName);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-center text-3xl font-bold text-blue-700 mb-18">
        Maruti Nisarg Laboratory Report Generator
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <PatientInfo onSave={handleSaveInfo} />
      </div>

      {/* ✅ Header & Footer Toggles */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col gap-3">
        <HeaderToggle onToggle={setIncludeHeader} />
        <FooterToggle onToggle={setIncludeFooter} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <TestEntry onSave={handleSaveReport} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <label
          htmlFor="description"
          className="block mb-2 font-medium text-blue-700"
        >
          📝 Description (optional):
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter any remarks or additional notes..."
          className="w-full min-h-[80px] border border-gray-300 rounded-lg p-2 resize-y"
        ></textarea>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <ReportPreview
          patientData={patientData}
          tests={tests}
          includeHeader={includeHeader}
          includeFooter={includeFooter}
          reportName={reportName}
          description={description}
        />
      </div>


      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "170px",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: "#00732F",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#3BAF5D")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#00732F")}
        >
          New Report
        </button>
      </div>



    </div>
  );
}

export default App;
