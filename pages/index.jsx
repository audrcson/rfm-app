import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabase";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { FiSearch } from "react-icons/fi";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  const [itemsPerPage, setItemsPerPage] = useState(20); // default laptop

useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setItemsPerPage(6); // mobile
    } else {
      setItemsPerPage(10); // tablet/laptop
    }
  };

  handleResize(); // set awal
  window.addEventListener("resize", handleResize); // update saat resize
  return () => window.removeEventListener("resize", handleResize);
}, []);


  
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("rfm").select("*");
      if (!error) setData(data);
    })();
  }, []);

  
  const filteredData = data?.filter((rfm) =>
    `${rfm.kode_mesin} ${rfm.nama_mesin}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  useEffect(() => setCurrentPage(1), [search]);

  return (
    <div
      className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} font-poppins p-8`}
    >
      {/* Judul – hidden saat print */}
      <h1 className="text-3xl font-bold mb-10 text-center px-2 print:hidden">
        Request For Maintenance QR Code
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 print:hidden">
        <div className="relative w-full md:w-1/3">
          <FiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kode mesin / nama mesin"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 border py-2 rounded-md w-full"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto print:hidden">
        {/* Grid QR */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 items-start">
          {paginatedData?.map((rfm) => (
            <div
              key={rfm.id}
              className="flex flex-col items-center text-center w-36 mx-auto"
            >
              <QRCode value={`https://rfm-app.vercel.app/rfm/${rfm.id}`} size={128} />
            <p className="mt-2 text-sm break-words">
              {rfm.kode_mesin}
            </p>
            <p className="text-sm break-words">
              {rfm.nama_mesin}
            </p>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4 text-sm print:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded disabled:opacity-50"
            >
              &lt;
            </button>

            <span className="px-3 font-medium"> {currentPage} / {totalPages}</span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>

        )}
      </div>


      <div className="hidden print:block">
        {filteredData?.map((rfm, idx) => (
          <div
            key={rfm.id}
            className="w-full h-[50vh] flex flex-col items-center justify-center text-center page-break"
          >
            <QRCode value={`https://rfm-app.vercel.app/rfm/${rfm.id}`} size={256} />
            <p className="mt-4 text-lg font-medium">{rfm.kode_mesin}</p>
            <p className="text-lg">{rfm.nama_mesin}</p>
          </div>
        ))}
      </div>

      
      {!data && (
        <p className="print:hidden">Loading…</p>
      )}
    </div>
  );
}
