import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { supabase } from "@/lib/supabase";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 6 : 10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
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
      <div className="max-w-5xl mx-auto print:hidden">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Request For Maintenance QR Code
        </h1>

        {/* Search & Print Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kode mesin / nama mesin"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 border-2 py-2 rounded-md w-full"
            />
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
            >
              Print Terpilih ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Grid QR */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {paginatedData?.map((rfm) => (
            <div
              key={rfm.id}
              className="relative flex flex-col items-center text-center w-36 mx-auto"
            >
              {/* Checkbox dengan jarak */}
              <div className="mb-2 self-start">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(rfm.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds([...selectedIds, rfm.id]);
                    } else {
                      setSelectedIds(selectedIds.filter((id) => id !== rfm.id));
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
              <QRCode value={`https://rfm-app.vercel.app/rfm/${rfm.id}`} size={128} />
              <p className="mt-2 text-sm break-words">{rfm.kode_mesin}</p>
              <p className="text-sm break-words">{rfm.nama_mesin}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <span className="px-2 font-medium rounded bg-gray-200 dark:bg-gray-700">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Hanya item yang dipilih akan muncul saat print */}
      <div className="hidden print:block">
        {filteredData
          ?.filter((rfm) => selectedIds.includes(rfm.id))
          .map((rfm) => (
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

      {!data && <p className="text-center print:hidden">Loading…</p>}
    </div>
  );
}
