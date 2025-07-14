// /pages/rfm/[id].jsx
import { supabase } from "@/lib/supabase";
import { Geist, Geist_Mono, Poppins } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <div className={`${poppins.variable} font-poppins min-h-screen flex items-center justify-center p-3`}>
      <div className="rounded-xl shadow-md w-full max-w-xl p-6 border border-gray-300">
        
        {/* Bagian Atas: Info Mesin */}
        <div className="mb-4">
          <p className="text-sm">
            <strong>{rfm.kode_mesin} - {rfm.nama_mesin}</strong> 
          </p>
        </div>

        {/* Judul */}
        <h1 className="text-center text-xl font-bold mb-4">
          RFM (Request For Maintenance)
        </h1>

        {/* List Informasi */}
        <div className="divide-y divide-gray-300 text-sm">
          <p className="py-2">
            <strong>No. RFM:</strong> {rfm.no_rfm}
          </p>
          <p className="py-2">
            <strong>Tgl Mesin Rusak / Bermasalah:</strong> {rfm.tanggal_kerusakan}
          </p>
          <p className="py-2">
            <strong>Deskripsi:</strong> {rfm.deskripsi}
          </p>
          <p className="py-2">
            <strong>No. KBJ:</strong> {rfm.kbj}
          </p>
        </div>
      </div>
    </div>
  );
}
