// /pages/rfm/[id].jsx
import { supabase } from "@/lib/supabase";

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
    <div style={{ padding: "2rem" }}>
      <h1>Detail RFM</h1>
      <p><strong>No RFM:</strong> {rfm.kode_mesin}</p>
      <p><strong>Tanggal Rusak:</strong> {rfm.nama_mesin}</p>
      <p><strong>Tanggal Rusak:</strong> {rfm.no_rfm}</p>
      <p><strong>Tanggal Rusak:</strong> {rfm.tanggal_kerusakan}</p>
      <p><strong>Deskripsi:</strong> {rfm.deskripsi}</p>
      <p><strong>Job Order ID:</strong> {rfm.job_order_id}</p>
      <p><strong>Rencana Penanganan:</strong> {rfm.date_plan_handling}</p>
      <p><strong>Aksi Penanganan:</strong> {rfm.action_handling}</p>
    </div>
  );
}
