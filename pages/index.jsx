// /pages/index.jsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import QRCode from "react-qr-code";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("rfm").select("*");
      if (!error) setData(data);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="text-green-400">QR Code RFM</h1>

      {!data && <p>Loading...</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        {data &&
          data.map((rfm) => (
            <div key={rfm.id} style={{ textAlign: "center" }}>
              <QRCode value={`https://rfm-app.vercel.app/rfm/${rfm.id}`} size={128} />
              <p style={{ marginTop: "0.5rem" }}>{rfm.kode_mesin} - {rfm.nama_mesin}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
