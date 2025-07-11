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
    <div className="p-8">
  <h1 className="text-green-400 text-2xl font-bold mb-6 text-center">QR Code RFM</h1>


  {!data && <p className="text-gray-500">Loading...</p>}

  <div className="flex flex-wrap gap-8">
    {data &&
      data.map((rfm) => (
        <div key={rfm.id} className="text-center">
          <QRCode value={`https://rfm-app.vercel.app/rfm/${rfm.id}`} size={128} />
          <p className="mt-2 text-sm text-gray-700">
            {rfm.kode_mesin} - {rfm.nama_mesin}
          </p>
        </div>
      ))}
  </div>
</div>

  );
}
