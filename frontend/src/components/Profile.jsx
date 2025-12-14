import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, User, FileText, Edit2, Save, Upload, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "", email: "", phone: "", age: "", city: "", accountNo: "", 
        salary: 0, creditScore: 0, preApprovedLimit: 0, panCard: "",
        isEmailVerified: false, isPhoneVerified: false, // verification flags
        documents: {}, extraDocs: []
    });
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({});

    // Fetch Data
    useEffect(() => {
        if (!auth.currentUser) return;
        const fetchProfile = async () => {
            const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData({ 
                    ...data, 
                    extraDocs: data.extraDocs || [],
                    // Ensure verification flags exist
                    isEmailVerified: data.isEmailVerified || auth.currentUser.emailVerified || false,
                    isPhoneVerified: data.isPhoneVerified || false
                });
                setEditData({ 
                    ...data, 
                    extraDocs: data.extraDocs || [],
                    isEmailVerified: data.isEmailVerified || auth.currentUser.emailVerified || false,
                    isPhoneVerified: data.isPhoneVerified || false
                });
            }
        };
        fetchProfile();
    }, []);

    // Handle Verification Logic
    const handleVerify = async (type) => {
        if (!auth.currentUser) return;
        
        // In a real app, you would send an OTP here. 
        // For now, we simulate instant verification.
        const field = type === 'email' ? 'isEmailVerified' : 'isPhoneVerified';
        
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), { [field]: true }, { merge: true });
            setUserData(prev => ({ ...prev, [field]: true }));
            setEditData(prev => ({ ...prev, [field]: true }));
            alert(`${type === 'email' ? 'Email' : 'Phone'} verified successfully!`);
        } catch (e) {
            console.error("Verification failed:", e);
        }
    };

    // Handle File Upload
    const handleFileUpload = async (key, file, isExtra = false, index = -1) => {
        if (!file || !auth.currentUser) return;
        setUploading(prev => ({ ...prev, [key]: true }));
        try {
            const path = `users/${auth.currentUser.uid}/${key}_${Date.now()}`;
            const fileRef = ref(storage, path);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);

            if (isExtra) {
                const newExtra = [...editData.extraDocs];
                newExtra[index] = { ...newExtra[index], url: url, fileName: file.name };
                setEditData(prev => ({ ...prev, extraDocs: newExtra }));
                await setDoc(doc(db, "users", auth.currentUser.uid), { extraDocs: newExtra }, { merge: true });
            } else {
                const newDocs = { ...editData.documents, [key]: url };
                setEditData(prev => ({ ...prev, documents: newDocs }));
                await setDoc(doc(db, "users", auth.currentUser.uid), { documents: newDocs }, { merge: true });
            }
        } catch (e) { console.error(e); }
        setUploading(prev => ({ ...prev, [key]: false }));
    };

    // Save Profile
    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), editData, { merge: true });
            setUserData(editData);
            setEditing(false);
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    // Custom Docs Logic
    const addExtraDoc = () => {
        setEditData(prev => ({ ...prev, extraDocs: [...(prev.extraDocs || []), { name: "New Document", url: "" }] }));
        setEditing(true);
    };
    const removeExtraDoc = (index) => {
        const newExtra = editData.extraDocs.filter((_, i) => i !== index);
        setEditData(prev => ({ ...prev, extraDocs: newExtra }));
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-[#FFD700]/10" />
            </div>

            <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ArrowLeft size={20} /> <span className="hidden md:inline">Back to Dashboard</span>
                </button>
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <User className="text-[#FFD700]" size={24} /> Borrower Profile
                </h1>
                {!editing ? (
                    <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[#FFD700] text-sm font-semibold transition">
                        <Edit2 size={16} /> Edit
                    </button>
                ) : (
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-[#FFD700] hover:bg-yellow-400 rounded-lg text-black text-sm font-bold transition">
                        <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            <main className="relative z-10 max-w-5xl mx-auto w-full p-6 space-y-8">
                
                {/* 1. FINANCIAL HEALTH CARD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-gradient-to-br from-[#1a1a1a] to-black p-6 rounded-2xl border border-[#FFD700]/30 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="text-center z-10">
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">CIBIL Score</p>
                            <div className="text-6xl font-black text-[#FFD700] mb-2">{userData.creditScore || 750}</div>
                            <span className="px-3 py-1 bg-[#FFD700]/10 text-[#FFD700] text-xs font-bold rounded-full">Excellent</span>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Full Name" value={editData.name} editing={editing} onChange={v => setEditData({...editData, name: v})} />
                            
                            {/* --- UPDATED: EMAIL WITH VERIFY BUTTON --- */}
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                    Email
                                    {userData.isEmailVerified ? (
                                        <span className="text-green-400 flex items-center gap-1 text-[10px] bg-green-400/10 px-2 py-0.5 rounded-full"><CheckCircle size={10} /> Verified</span>
                                    ) : (
                                        <button onClick={() => handleVerify('email')} className="text-[#FFD700] hover:text-yellow-300 text-[10px] flex items-center gap-1 border border-[#FFD700]/30 px-2 py-0.5 rounded-full hover:bg-[#FFD700]/10 transition">
                                            Verify Now
                                        </button>
                                    )}
                                </label>
                                <p className="text-lg font-medium text-white p-3 bg-black/20 rounded-lg border border-white/5">{userData.email || auth.currentUser?.email}</p>
                            </div>

                            {/* --- UPDATED: PHONE WITH VERIFY BUTTON --- */}
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                    Phone
                                    {userData.isPhoneVerified ? (
                                        <span className="text-green-400 flex items-center gap-1 text-[10px] bg-green-400/10 px-2 py-0.5 rounded-full"><CheckCircle size={10} /> Verified</span>
                                    ) : (
                                        <button onClick={() => handleVerify('phone')} className="text-[#FFD700] hover:text-yellow-300 text-[10px] flex items-center gap-1 border border-[#FFD700]/30 px-2 py-0.5 rounded-full hover:bg-[#FFD700]/10 transition">
                                            Verify Now
                                        </button>
                                    )}
                                </label>
                                {editing ? (
                                    <input type="tel" value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none" />
                                ) : (
                                    <p className="text-lg font-medium text-white">{userData.phone || "Not Set"}</p>
                                )}
                            </div>

                            <Field label="PAN Number" value={editData.panCard} editing={editing} onChange={v => setEditData({...editData, panCard: v.toUpperCase()})} />
                            <Field label="Monthly Salary" value={editData.salary} editing={editing} type="number" onChange={v => setEditData({...editData, salary: v})} />
                            <Field label="City" value={editData.city} editing={editing} onChange={v => setEditData({...editData, city: v})} />
                        </div>
                    </div>
                </div>

                {/* 2. DOCUMENTS VAULT */}
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FileText className="text-[#FFD700]" size={20} /> Document Vault
                        </h3>
                        {editing && (
                            <button onClick={addExtraDoc} className="text-xs flex items-center gap-1 text-[#FFD700] hover:underline">
                                <Plus size={14} /> Add Custom Doc
                            </button>
                        )}
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DocUpload label="PAN Card Image" fileKey="panCard" url={editData.documents?.panCard} uploading={uploading.panCard} onUpload={(f) => handleFileUpload("panCard", f)} editing={editing} />
                        <DocUpload label="Salary Slip" fileKey="salarySlip" url={editData.documents?.salarySlip} uploading={uploading.salarySlip} onUpload={(f) => handleFileUpload("salarySlip", f)} editing={editing} />
                        
                        {editData.extraDocs?.map((doc, idx) => (
                            <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/10 relative group">
                                {editing && (
                                    <button onClick={() => removeExtraDoc(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                                )}
                                <div className="mb-2">
                                    {editing ? (
                                        <input type="text" value={doc.name} onChange={(e) => { const newExtra = [...editData.extraDocs]; newExtra[idx].name = e.target.value; setEditData({...editData, extraDocs: newExtra}); }} className="bg-transparent border-b border-white/20 text-sm font-semibold text-white w-full outline-none focus:border-[#FFD700]" />
                                    ) : <p className="text-sm font-semibold text-gray-300">{doc.name}</p>}
                                </div>
                                <DocUpload label="" fileKey={`extra_${idx}`} url={doc.url} uploading={uploading[`extra_${idx}`]} onUpload={(f) => handleFileUpload(`extra_${idx}`, f, true, idx)} editing={editing} compact />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

// Helpers
const Field = ({ label, value, editing, onChange, type = "text" }) => (
    <div>
        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 block">{label}</label>
        {editing ? (
            <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[#FFD700] outline-none transition" />
        ) : <p className="text-lg font-medium text-white">{value || "Not Set"}</p>}
    </div>
);

const DocUpload = ({ label, url, uploading, onUpload, editing, compact }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${url ? 'bg-[#FFD700]/5 border-[#FFD700]/30' : 'bg-white/5 border-dashed border-white/20'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${url ? 'bg-[#FFD700] text-black' : 'bg-white/10 text-gray-400'}`}>
                {url ? <CheckCircle size={16} /> : <FileText size={16} />}
            </div>
            {!compact && <span className="text-sm font-medium text-gray-300 truncate">{label}</span>}
        </div>
        <div className="flex items-center gap-2">
            {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#FFD700] hover:underline">View</a>}
            {(editing || !url) && (
                <label className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded-md transition relative">
                    <input type="file" className="hidden" onChange={(e) => onUpload(e.target.files[0])} disabled={uploading} />
                    {uploading ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"/> : <Upload size={14} className="text-gray-300" />}
                </label>
            )}
        </div>
    </div>
);

export default Profile;