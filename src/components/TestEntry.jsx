// src/components/TestEntry.jsx
import { useEffect, useState } from "react";
import reportsData from "../data/reportsData.json";

function TestEntry({ onSave }) {
    const [selectedReport, setSelectedReport] = useState("");
    const [testList, setTestList] = useState([]);
    const [results, setResults] = useState({});

    useEffect(() => {
        if (selectedReport) {
            const tests = reportsData[selectedReport] || [];
            setTestList(tests);
            setResults({});
        }
    }, [selectedReport]);

    const handleResultChange = (testName, value) => {
        setResults((prev) => ({ ...prev, [testName]: value }));
    };

    const handleSaveTests = () => {
        const finalTests = testList.map((t) => ({
            name: t.name,
            range: t.range,
            unit: t.unit,
            result: results[t.name] || "",
        }));

        onSave(finalTests, selectedReport); // ✅ send report name too
    };


    const addEmptyRow = () => {
        const newRow = { name: "", range: "", unit: "", manual: true };
        setTestList((prev) => [...prev, newRow]);
    };


    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">🧪 Select Report Type</h2>

            {/* Report Selection Dropdown */}
            <select
                className="border p-2 rounded-md w-full mb-4"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
            >
                <option value="">-- Select Report --</option>
                {Object.keys(reportsData).map((key) => (
                    <option key={key} value={key}>
                        {key}
                    </option>
                ))}
            </select>

            {/* ✅ Dynamic Report Heading */}
            {selectedReport && (
                <h3 className="text-xl font-bold text-center text-red-700 uppercase mb-3 underline tracking-wide">
                    {selectedReport} Report
                </h3>
            )}

            {/* Test Table */}
            {selectedReport && (
                <table className="w-full border-collapse border border-gray-400 text-center text-sm">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-1">Test Name</th>
                            <th className="border p-1">Result</th>
                            <th className="border p-1">Normal Range</th>
                            <th className="border p-1">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testList.map((t, i) => (
                            <tr key={i}>
                                {/* Test Name */}
                                <td className="border p-1">
                                    {t.manual ? (
                                        <input
                                            type="text"
                                            value={t.name}
                                            onChange={(e) => {
                                                const updated = [...testList];
                                                updated[i].name = e.target.value;
                                                setTestList(updated);
                                            }}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    ) : (
                                        t.name
                                    )}
                                </td>

                                {/* Result */}
                                <td className="border p-1">
                                    <input
                                        type="text"
                                        value={results[t.name] || ""}
                                        onChange={(e) => handleResultChange(t.name, e.target.value)}
                                        className="border rounded-md p-1 w-full"
                                    />
                                </td>

                                {/* Range */}
                                <td className="border p-1">
                                    {t.manual ? (
                                        <input
                                            type="text"
                                            value={t.range}
                                            onChange={(e) => {
                                                const updated = [...testList];
                                                updated[i].range = e.target.value;
                                                setTestList(updated);
                                            }}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    ) : (
                                        t.range
                                    )}
                                </td>

                                {/* Unit */}
                                <td className="border p-1">
                                    {t.manual ? (
                                        <input
                                            type="text"
                                            value={t.unit}
                                            onChange={(e) => {
                                                const updated = [...testList];
                                                updated[i].unit = e.target.value;
                                                setTestList(updated);
                                            }}
                                            className="border rounded-md p-1 w-full"
                                        />
                                    ) : (
                                        t.unit
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}




            {/* Add Manual Test Button */}


            {selectedReport && (
                <div className="text-right mt-3">
                    <button
                        onClick={addEmptyRow}
                        style={{
                            marginTop: "16px",
                            // marginRight: "10px",
                            backgroundColor: "#00732F", // green
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "600",
                        }}
                    >
                        Add New Row
                    </button>
                </div>
            )}




            {/* Save Report Button */}
            {selectedReport && (
                <div className="text-right mt-3">
                    <button
                        onClick={handleSaveTests}
                        style={{
                            marginTop: "16px",
                            backgroundColor: "#2563eb", // blue-600
                            color: "#ffffff",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Save Report
                    </button>
                </div>
            )}
        </div>
    );
}

export default TestEntry;
