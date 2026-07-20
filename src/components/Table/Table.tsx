import { useState, useMemo, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import type { SortDirection, TableProps } from "./types";
import { FaLongArrowAltUp } from "react-icons/fa";
import Loader from "../Loader";

// <T extends object> – a T tetszőleges objektum lehet (nem kell index signature).
// A sortKey szerinti indexeléshez lokálisan Record<string, unknown>-ra kasztolunk.
const Table = <T extends object>({
  data,
  columns,
  pageSize = 10,
  className = "",
  emptyMessage = "Nincs adat",
  loading = false,
  error = "",
  itemLabel = "elem",
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Rendezés logika
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    const sortColumn = columns.find((col) => col.key === sortKey);

    return [...data].sort((a, b) => {
      const aValue = sortColumn?.valueBySort
        ? sortColumn.valueBySort(a)
        : (a as Record<string, unknown>)[sortKey];
      const bValue = sortColumn?.valueBySort
        ? sortColumn.valueBySort(b)
        : (b as Record<string, unknown>)[sortKey];

      // Ha ugyanaz az érték
      if (aValue === bValue) return 0;

      // null/undefined értékek kezelése (mindig a végére)
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Számok esetén numerikus összehasonlítás
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Ha mindkét érték szám-szerű stringek (pl. "123", "45.6")
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Dátumok esetén
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === "asc"
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // String összehasonlítás (alapértelmezett)
      const aStr = String(aValue);
      const bStr = String(bValue);

      return sortDirection === "asc"
        ? aStr.localeCompare(bStr, "hu", { sensitivity: "base", numeric: true })
        : bStr.localeCompare(aStr, "hu", { sensitivity: "base", numeric: true });
    });
  }, [data, sortKey, sortDirection, columns]);

  // Lapozás logika
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Rendezés kezelése
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortKey === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(columnKey);
      setSortDirection("asc");
    }
  };

  // Lapozás kezelése
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Lapozás reset ha új data érkezik vagy rendezés változik
  useEffect(() => {
    setCurrentPage(1);
  }, [data, sortKey, sortDirection]);

  // Grid template columns számítása
  const gridColumns = useMemo(() => {
    return columns
      .map((col) => {
        if (col.width) {
          // Ha Tailwind class (pl. w-48), konvertáljuk CSS értékre
          if (col.width.startsWith("w-")) {
            const sizeMap: Record<string, string> = {
              "w-8": "2rem",
              "w-12": "3rem",
              "w-16": "4rem",
              "w-20": "5rem",
              "w-24": "6rem",
              "w-28": "7rem",
              "w-32": "8rem",
              "w-40": "10rem",
              "w-44": "11rem",
              "w-48": "12rem",
              "w-64": "16rem",
              "w-auto": "auto",
              "w-full": "100%",
            };
            return sizeMap[col.width] || "1fr";
          }
          // Ha már CSS érték (pl. 200px, 20%, auto)
          return col.width;
        }
        return "1fr";
      })
      .join(" ");
  }, [columns]);

  return (
    <div className={`bg-panel-bg border border-primary rounded-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-surface border-b border-primary/50">
        <div
          className="grid gap-2 px-4 py-3"
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              className={`flex items-center gap-1 text-sm font-medium ${column.className} ${
                column.sortable ? "cursor-pointer hover:text-button-bg-hover transition-colors" : ""
              }`}
              onClick={() => handleSort(column.key)}
            >
              <span>{column.header}</span>
              {column.sortable && (
                <div className="ml-1">
                  <FaLongArrowAltUp
                    size={12}
                    className={`transition-all duration-200 ${
                      sortKey === column.key && sortDirection === "asc"
                        ? "rotate-180 text-button-bg-hover"
                        : sortKey === column.key && sortDirection === "desc"
                          ? "text-button-bg-hover"
                          : "hidden"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="relative divide-y divide-primary/20 min-h-[50px]">
        {loading && (
          <div className="absolute inset-0 bg-black/50 pt-10 divide-y text-center text-white">
            <Loader text="Táblázat betöltése..." />
          </div>
        )}
        {error && !loading && <div className="px-4 py-8 text-center text-red-500">{error}</div>}
        {!error && currentData.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400">{!loading && emptyMessage}</div>
        ) : (
          !error &&
          currentData.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 px-4 py-3 hover:bg-surface/30 transition-colors"
              style={{
                gridTemplateColumns: gridColumns,
              }}
            >
              {columns.map((column) => (
                <div key={column.key} className="flex items-center text-sm">
                  {column.render(item, startIndex + index)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Footer with Pagination */}
      {totalPages > 1 && (
        <div className="bg-surface border-t border-primary/50 px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Összesen {sortedData.length} {itemLabel}, {totalPages} oldal
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IoChevronBackOutline size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-2 py-1 text-sm rounded transition-colors ${
                      currentPage === pageNum ? "bg-primary text-white" : "hover:bg-primary/20"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IoChevronForwardOutline size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
