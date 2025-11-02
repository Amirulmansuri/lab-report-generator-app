import { useState, useEffect, useRef } from "react";

export default function PatientInfo({ onSave }) {
    const [info, setInfo] = useState({
        name: "",
        age: "",
        gender: "Male",
        contact: "",
        date: "",
        patientId: "",
        referredBy: "", // ✅ new field added
    });

    const [isManualDoctor, setIsManualDoctor] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return; // prevent double run
        initialized.current = true;

        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];

        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yy = String(today.getFullYear()).slice(-2);

        const stored = JSON.parse(localStorage.getItem("patientSeries")) || {};
        let newSeries = 1;

        if (stored.date === formattedDate) {
            newSeries = stored.series + 1;
        }

        localStorage.setItem(
            "patientSeries",
            JSON.stringify({ date: formattedDate, series: newSeries })
        );

        const patientId = `${dd}${mm}${yy}/${String(newSeries).padStart(3, "0")}`;

        setInfo((prev) => ({
            ...prev,
            date: formattedDate,
            patientId,
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle doctor selection separately
        if (name === "referredBy") {
            if (value === "manual") {
                setIsManualDoctor(true);
                setInfo((prev) => ({ ...prev, referredBy: "" }));
            } else {
                setIsManualDoctor(false);
                setInfo((prev) => ({ ...prev, referredBy: value }));
            }
        } else {
            setInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        // Validation check
        if (!info.name.trim()) {
            alert("Please enter patient name.");
            return;
        }
        if (!info.age.trim()) {
            alert("Please enter age.");
            return;
        }
        if (!info.contact.trim()) {
            alert("Please enter contact number.");
            return;
        }
        if (!/^\d{10}$/.test(info.contact)) {
            alert("Please enter valid 10-digit phone number.");
            return;
        }
        if (!info.gender.trim()) {
            alert("Please select gender.");
            return;
        }
        if (!info.referredBy.trim()) {
            alert("Please select or enter referred doctor.");
            return;
        }




        // ✅ All good, save data
        onSave(info, []);
    };





    return (
        <div
            style={{
                backgroundColor: "#ffffff",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "16px",
            }}
        >
            <h2 style={{ fontSize: "25px", fontWeight: 600, marginBottom: "35px" }}>
                Patient Information
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                }}
            >

                {/* Patient Name */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Patient Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Patient Name"
                        value={info.name}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "90%",
                        }}
                    />
                </div>

                {/* Age */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Age
                    </label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Enter Age"
                        value={info.age}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "90%",
                        }}
                    />
                </div>

                {/* Gender */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={info.gender}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "92%",
                        }}
                    >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* Contact */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Contact Number
                    </label>
                    <input
                        type="text"
                        name="contact"
                        placeholder="Enter Contact Number"
                        value={info.contact}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "90%",
                        }}
                    />
                </div>

                {/* Date */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Date
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={info.date}
                        readOnly
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            backgroundColor: "#f3f4f6",
                            width: "90%",
                        }}
                    />
                </div>

                {/* Patient ID */}
                <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Patient ID
                    </label>
                    <input
                        type="text"
                        name="patientId"
                        value={info.patientId}
                        readOnly
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            backgroundColor: "#f3f4f6",
                            width: "90%",
                            fontWeight: 600,
                        }}
                    />
                </div>

                {/* Referred By Doctor */}
                <div style={{ gridColumn: "1 / span 2" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 700 }}>
                        Referred By Doctor
                    </label>
                    <select
                        name="referredBy"
                        value={isManualDoctor ? "manual" : info.referredBy}
                        onChange={handleChange}
                        required
                        style={{
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            width: "95%",
                            marginBottom: "6px",
                        }}
                    >
                        <option value="">-- Select Doctor --</option>
                        <option value="Dr. C. B. Patel">Dr. C. B. Patel</option>
                        <option value="Dr. Maulik Patel">Dr. Maulik Patel</option>
                        <option value="Dr. Jignesh Patel">Dr. Jignesh Patel</option>
                        <option value="Dr. S. C. Pandya">Dr. S. C. Pandya</option>
                        <option value="Dr. Jignesh Vasava">Dr. Jignesh Vasava</option>
                        <option value="Dr. Nimit Patel">Dr. Nimit Patel</option>
                        <option value="Dr. Rakesh Patel">Dr. Rakesh Patel</option>
                        <option value="Dr. Imran Luhar">Dr. Imran Luhar</option>
                        <option value="Dr. Rai">Dr. Rai</option>
                        <option value="manual">✍️ Write Manually</option>
                    </select>

                    {isManualDoctor && (
                        <input
                            type="text"
                            placeholder="Enter Doctor Name"
                            value={info.referredBy}
                            onChange={(e) =>
                                setInfo((prev) => ({
                                    ...prev,
                                    referredBy: e.target.value,
                                }))
                            }
                            style={{
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                width: "100%",
                            }}
                        />
                    )}
                </div>
            </div>

            <button
                onClick={handleSave}
                style={{
                    marginTop: "16px",
                    marginLeft: "670px",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
                Save Info
            </button>
        </div>
    );
}
