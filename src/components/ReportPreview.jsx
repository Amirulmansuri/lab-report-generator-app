import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CustomHeader } from "./HeaderToggle";
import { CustomFooter } from "./FooterToggle.jsx";

function ReportPreview({
    patientData,
    tests,
    includeHeader,
    includeFooter,
    reportName,
    description,
}) {
    const reportRef = useRef();
    const [localPatient, setLocalPatient] = useState(null);
    const [localTests, setLocalTests] = useState([]);
    const [localReportName, setLocalReportName] = useState("");

    useEffect(() => {
        if (patientData) setLocalPatient(patientData);
        if (tests && tests.length > 0) setLocalTests(tests);
        if (reportName) setLocalReportName(reportName);
    }, [patientData, tests, reportName]);

    const waitForImages = (element) => {
        const imgs = element.getElementsByTagName("img");
        return Promise.all(
            Array.from(imgs).map(
                (img) =>
                    new Promise((resolve) => {
                        if (img.complete) resolve();
                        else img.onload = img.onerror = resolve;
                    })
            )
        );
    };

    const handleSavePDF = async () => {
        if (!reportRef.current) return;

        try {
            await waitForImages(reportRef.current);

            const input = reportRef.current;
            const canvas = await html2canvas(input, {
                scale: 2,
                scrollY: -window.scrollY,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: input.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= 295;

            while (heightLeft > 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
                heightLeft -= 295;
            }

            const fileName = `${localPatient?.name || "Lab_Report"}_${localPatient?.patientId || "ID"
                }.pdf`;
            pdf.save(fileName);
            alert("✅ PDF saved successfully!");
        } catch (err) {
            console.error("❌ PDF generation failed:", err);
            alert("Something went wrong while saving the report!");
        }
    };

    return (
        <div
            style={{
                backgroundColor: "#000", // black background like PDF viewer
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "40px 0",
            }}
        >
            {/* ---------- Centered A4 Report ---------- */}
            <div
                ref={reportRef}
                style={{
                    width: "210mm",
                    minHeight: "297mm", // full A4 height
                    backgroundColor: "#fff",
                    padding: "20mm",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    position: "relative",
                    boxShadow: "0 0 30px rgba(0,0,0,0.6)", // shadow for realistic preview
                    borderRadius: "6px",
                }}
            >
                {/* ---------- Top Section ---------- */}
                <div style={{ flexGrow: 1 }}>
                    {includeHeader ? (
                        <div style={{ marginBottom: "16px" }}>
                            <CustomHeader />
                        </div>
                    ) : (
                        <div style={{ height: "80px", marginBottom: "16px" }}></div>
                    )}

                    {/* Patient Info */}
                    {localPatient && (
                        <div
                            style={{
                                border: "1px solid #9ca3af",
                                borderRadius: "6px",
                                padding: "8px 12px",
                                marginBottom: "10px",
                                backgroundColor: "#f9fafb",
                                fontSize: "15px",
                                color: "#111827",
                            }}
                        >
                            <h3
                                style={{
                                    textAlign: "center",
                                    fontWeight: 700,
                                    color: "#111827",
                                    borderBottom: "1px solid #9ca3af",
                                    marginBottom: "6px",
                                    paddingBottom: "2px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Patient Information
                            </h3>

                            {/* Row 1: Name / Age / Gender */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "3px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <strong>Name:</strong>{" "}
                                    <span>{localPatient?.name || "-"}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>Age:</strong>{" "}
                                    <span>{localPatient?.age || "-"}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>Gender:</strong>{" "}
                                    <span>{localPatient?.gender || "-"}</span>
                                </div>
                            </div>

                            {/* Row 2: Contact / Date / Patient ID */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "3px",
                                    paddingTop: "5px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <strong>Contact:</strong>{" "}
                                    <span>{localPatient?.contact || "-"}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>Date:</strong>{" "}
                                    <span>
                                        {localPatient?.date
                                            ? new Date(localPatient.date).toLocaleDateString("en-GB")
                                            : "-"}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <strong>Patient ID:</strong>{" "}
                                    <span>{localPatient?.patientId || "-"}</span>
                                </div>
                            </div>

                            {/* ✅ Row 3: Referred Doctor */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    marginBottom: "5px",
                                    // borderTop: "1px solid #e5e5e5",
                                    paddingTop: "5px",
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <strong>Referred By:</strong>{" "}
                                    <span>{localPatient?.referredBy || "—"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Report Name */}
                    {localReportName && (
                        <h3
                            style={{
                                textAlign: "center",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#b91c1c",
                                textDecoration: "underline",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                            }}
                        >
                            {localReportName} Report
                        </h3>
                    )}

                    {/* Tests */}
                    {localTests?.length > 0 ? (
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                textAlign: "center",
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: "#e5e7eb" }}>
                                    <th style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                        Test Name
                                    </th>
                                    <th style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                        Result
                                    </th>
                                    <th style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                        Normal Range
                                    </th>
                                    <th style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                        Unit
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {localTests.map((t, i) => (
                                    <tr key={i}>
                                        <td style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                            {t.name}
                                        </td>
                                        <td style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                            {t.result}
                                        </td>
                                        <td style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                            {t.range}
                                        </td>
                                        <td style={{ border: "1px solid #9ca3af", padding: "4px" }}>
                                            {t.unit}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ textAlign: "center", color: "#6b7280" }}>
                            No tests entered yet.
                        </p>
                    )}

                    {/* Description */}
                    {description && description.trim() !== "" && (
                        <div
                            style={{
                                marginTop: "20px",
                                border: "1px solid #9ca3af",
                                borderRadius: "6px",
                                padding: "10px 12px",
                                backgroundColor: "#fefce8",
                                fontSize: "14px",
                                color: "#111827",
                            }}
                        >
                            <strong
                                style={{ display: "block", marginBottom: "4px", color: "#b91c1c" }}
                            >
                                Description / Remarks:
                            </strong>
                            <p style={{ whiteSpace: "pre-line", margin: 0 }}>{description}</p>
                        </div>
                    )}
                </div>

                {/* Doctor Name */}
                <div style={{ textAlign: "right", marginTop: "6px", paddingRight: "40px" }}>
                    <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "2px" }}>
                        Mrs. Heena V. Modh
                    </p>
                    <p style={{ fontSize: "12px", fontStyle: "italic" }}>B.Sc. PGDMLT</p>
                </div>

                {/* ---------- Conditional Footer ---------- */}
                {includeFooter && (
                    <div
                        style={{
                            marginTop: "auto",
                            paddingTop: "8px",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#111",
                            backgroundColor: "#fff",
                        }}
                    >
                        <CustomFooter />
                    </div>
                )}
            </div>

            {/* ---------- Floating Save PDF Button ---------- */}
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "40px",
                    zIndex: 100,
                }}
            >
                <button
                    onClick={handleSavePDF}
                    style={{
                        backgroundColor: "#FF0000",
                        color: "#fff",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#FF7F7F")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#FF0000")}
                >
                    Save as PDF
                </button>
            </div>
        </div>
    );

}

export default ReportPreview;
