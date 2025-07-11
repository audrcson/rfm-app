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
    <div className="min-h-screen bg-gray-100 text-green-600 text-3xl font-bold flex items-center justify-center">
      Tailwind works on [id].jsx ✅
    </div>
  );
}
