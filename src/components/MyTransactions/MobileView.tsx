import type { Transaction } from "@/models/transaction.type";
import { getTransactionTypeColors, getTransactionTypeText } from "@/utils/common";
import type { FC } from "react";

interface MyTransactionsMobileProps {
  data: Transaction[];
}

const MyTransactionsMobile: FC<MyTransactionsMobileProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-3 p-2">
      {data.length === 0 && <div className="text-center text-gray-400 py-8">Nincs tranzakció.</div>}
      {data.map((tx) => {
        const matchInfo = tx.matchid
          ? `${tx.matchid.teamA?.name ?? ""} - ${tx.matchid.teamB?.name ?? ""}`
          : null;
        const typeClass = getTransactionTypeColors[tx.type] || "bg-gray-400 text-white";
        return (
          <div
            key={tx._id}
            className="rounded-2xl shadow-lg bg-linear-to-br from-gray-800 to-gray-900 
            p-3 border border-gray-700"
          >
            {/* Title: comment */}
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-white wrap-break-word max-w-[70%]">
                {tx.comment || "Tranzakció"}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeClass}`}>
                {getTransactionTypeText(tx.type)}
              </span>
            </div>
            {/* Subtitle: date */}
            <div className="text-xs text-gray-400 mb-3">
              {new Date(tx.date).toLocaleString("hu-HU", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {/* Info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Összeg:</span>
                <span
                  className={`text-sm font-bold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount} pont
                </span>
              </div>
              {matchInfo && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Mérkőzés:</span>
                  <span className="text-gray-300 text-sm">{matchInfo}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyTransactionsMobile;
