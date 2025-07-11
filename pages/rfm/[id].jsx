// /pages/rfm/[id].jsx
import { supabase } from "@/lib/supabase";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export async function getServerSideProps(context) {
  const { id } = context.params;
  const { data, error } = await supabase
    .from("rfm")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: { rfm: data || null, error: error?.message || null },
  };
}

export default function RFMDetail({ rfm, error }) {
  if (error) return <p>Error: {error}</p>;
  if (!rfm) return <p>Data not found</p>;

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="bg-white rounded-xl shadow-md w-full max-w-xl p-6 border border-gray-300">
      
      {/* Bagian Atas: Info Mesin */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <strong>{rfm.kode_mesin} - {rfm.nama_mesin}</strong> 
        </p>
      </div>

      {/* Judul */}
      <h1 className="text-center text-xl font-bold text-green-600 mb-4">
        RFM (Request For Maintenance)
      </h1>

      {/* List Informasi */}
      <div className="divide-y divide-gray-300 text-gray-700 text-sm">
        <p className="py-2">
          <strong>No RFM:</strong> {rfm.no_rfm}
        </p>
        <p className="py-2">
          <strong>Tgl Mesin Rusak / Bermasalah:</strong> {rfm.tanggal_kerusakan}
        </p>
        <p className="py-2">
          <strong>Deskripsi:</strong> {rfm.deskripsi}
        </p>
        <p className="py-2">
          <strong>Aksi Penanganan:</strong> {rfm.action_handling}
        </p>
        <p className="py-2">
          <strong>No KJB:</strong> {rfm.kjb}
        </p>
      </div>
    </div>
  </div>
);
}
