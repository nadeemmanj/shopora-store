"use client";
import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [f, setF] = useState({ storeName: "", tagline: "", supportEmail: "", supportPhone: "", address: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setF({
            storeName: d.settings.storeName || "",
            tagline: d.settings.tagline || "",
            supportEmail: d.settings.supportEmail || "",
            supportPhone: d.settings.supportPhone || "",
            address: d.settings.address || "",
          });
        }
      });
  }, []);

  const save = async () => {
    const r = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const d = await r.json();
    setMsg(d.settings ? "Settings saved to database." : "Failed to save.");
  };

  const inp = "w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-violet";
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-extrabold mb-5">Settings</h2>
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div><label className="text-sm font-semibold">Store name</label><input className={inp} value={f.storeName} onChange={set("storeName")} /></div>
        <div><label className="text-sm font-semibold">Tagline</label><input className={inp} value={f.tagline} onChange={set("tagline")} /></div>
        <div><label className="text-sm font-semibold">Support email</label><input className={inp} value={f.supportEmail} onChange={set("supportEmail")} /></div>
        <div><label className="text-sm font-semibold">Support phone</label><input className={inp} value={f.supportPhone} onChange={set("supportPhone")} /></div>
        <div><label className="text-sm font-semibold">Address</label><input className={inp} value={f.address} onChange={set("address")} /></div>
        {msg && <p className="text-sm font-semibold text-green-600">{msg}</p>}
        <button onClick={save} className="bg-brand-violet text-white px-8 py-3 rounded-full font-bold">Save Settings</button>
      </div>
    </div>
  );
}
