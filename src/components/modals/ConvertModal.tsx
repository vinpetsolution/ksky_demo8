"use client";

import { useCallback, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input } from "../ui/Input";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/classNames";
import { Button } from "../ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import type { TransactionListItem } from "@/models/transaction";

export type ConvertModalProps = {
  open: boolean;
  onClose: () => void;
};

const PRESET_ADD: { key: string; label: string; add: number | "full" }[] = [
  { key: "10k", label: "1만", add: 10_000 },
  { key: "50k", label: "5만", add: 50_000 },
  { key: "100k", label: "10만", add: 100_000 },
  { key: "full", label: "전액", add: "full" },
];

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleString("ko-KR");
  } catch {
    return dateStr;
  }
}

function formatWon(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function ConvertModal({ open, onClose }: ConvertModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<TransactionListItem[]>([]);

  const rollingMax = user?.balancePoint ?? 0;
  const balanceMoney = user?.balanceMoney ?? 0;

  const clampToRolling = useCallback(
    (n: number) => Math.max(0, Math.min(rollingMax, n)),
    [rollingMax]
  );

  const handlePreset = (add: number | "full") => {
    if (add === "full") {
      setAmount(rollingMax);
      return;
    }
    setAmount(clampToRolling(amount + add));
  };

  const handleSubmit = async () => {
    if (!user || amount <= 0 || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const item: TransactionListItem = {
        id: `demo-convert-${history.length + 1}`,
        userId: user.userName,
        amount,
        type: "Transfer",
        status: "COMPLETED",
        note: "데모 전환",
        createdAt: now,
        updatedAt: now,
      };
      setHistory((prev) => [item, ...prev].slice(0, 10));
      alert("전환이 완료되었습니다.");
      setAmount(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton
      className="w-full border-[#ead9b0]"
      contentClassName="!p-0 flex min-h-0 max-h-[min(88vh,860px)] flex-col"
      headerClassName="shrink-0 px-5 py-4 items-start justify-start bg-[radial-gradient(circle_at_top,#f3e6c4,#ffffff_70%)]"
      title={
        <>
          <div className="w-full flex flex-col gap-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#a6853d]">
              KSKY SOLUTION CONVERT
            </p>
            <h2 className="text-xl font-bold text-[#1a1a1a]">롤링 전환</h2>
            <p className="text-xs text-[#8a7560]">
              롤링 포인트를 보유머니로 안전하게 전환할 수 있습니다.
            </p>
          </div>
        </>
      }
    >
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 scrollbar">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#ead9b0] bg-[#fbf7f0] px-3 py-3">
            <p className="text-[11px] text-[#8a7560]">보유머니</p>
            <p className="mt-1 text-base font-extrabold text-[#a6853d] md:text-lg">
              {formatNumber(balanceMoney)}원
            </p>
          </div>
          <div className="rounded-xl border border-[#ead9b0] bg-[#fbf7f0] px-3 py-3">
            <p className="text-[11px] text-[#8a7560]">롤링 포인트</p>
            <p className="mt-1 text-base font-extrabold text-[#a6853d] md:text-lg">
              {formatNumber(rollingMax)}P
            </p>
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-[0.08em] text-[#a6853d]">
              전환 타입
            </label>
            <div className="rounded-lg border border-[#e4d2a4] bg-[linear-gradient(180deg,#f3e0b0,#c6a15b)] px-3 py-2 text-sm font-bold text-[#1a1a1a] shadow-[0_8px_18px_#c6a15b22]">
              롤링
              <span className="ml-1 text-xs text-[#1a1a1a]">
                {formatNumber(rollingMax)}P
              </span>
            </div>
            <p className="mt-2 text-xs text-[#8a7560]">
              전환 가능 금액: {formatNumber(rollingMax)}P
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="0"
              type="text"
              inputMode="numeric"
              labelClassName="text-[#a6853d] font-semibold text-xs"
              label="전환 금액"
              value={amount === 0 ? "" : formatNumber(amount)}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9]/g, "");
                if (!v) {
                  setAmount(0);
                  return;
                }
                setAmount(clampToRolling(Number(v)));
              }}
              rightIcon={
                <span className="text-sm font-bold text-[#a6853d]">P</span>
              }
              className={cn(
                "h-12 w-full px-4 py-2 pr-10 text-right text-sm",
                "border-[#ead9b0] text-lg focus:ring-[#c6a15b]/30 placeholder:text-[#8a7560]",
                "font-extrabold placeholder:font-extrabold text-[#1a1a1a] bg-white"
              )}
              fullWidth
              aria-label="전환 금액"
            />
            <div className="grid grid-cols-4 gap-2">
              {PRESET_ADD.map(({ key, label, add }) => (
                <Button
                  key={key}
                  type="button"
                  variant="transparent"
                  className={cn(
                    "h-auto border px-2 py-1.5 text-xs font-semibold",
                    add === "full"
                      ? "border-[#c6a15b] bg-[#f8f1df] text-[#1a1a1a] hover:border-[#c6a15b] hover:bg-[#f3e6c4] hover:text-[#1a1a1a]"
                      : "border-[#ead9b0] bg-white text-[#a6853d] hover:border-[#c6a15b] hover:text-[#1a1a1a]"
                  )}
                  onClick={() => handlePreset(add)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl text-[15px] font-extrabold"
            disabled={isSubmitting || amount <= 0}
          >
            {isSubmitting ? "처리중..." : "전환 신청"}
          </Button>
        </form>

        <div className="rounded-xl border border-[#ead9b0] bg-[#fbf7f0] px-4 py-3 text-xs text-[#8a7560]">
          <ul className="list-inside list-disc">
            <li>전환된 금액은 즉시 보유머니로 적립됩니다.</li>
            <li>최근 전환 내역은 최대 10건까지 확인할 수 있습니다.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-[#ead9b0] bg-[#fbf7f0] px-4 py-3 text-xs text-[#8a7560]">
          <h3 className="mb-3 text-sm font-bold text-[#1a1a1a]">전환 내역</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-xs">
              <thead>
                <tr className="border-b border-[#ead9b0] text-[#8a7560]">
                  <th className="px-3 py-2 text-left">일시</th>
                  <th className="px-3 py-2 text-left">구분</th>
                  <th className="px-3 py-2 text-right">금액</th>
                  <th className="px-3 py-2 text-center">상태</th>
                  <th className="px-3 py-2 text-left">비고</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-[#8a7560]">
                      전환 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  history.map((row) => (
                    <tr key={row.id} className="border-b border-[#f3e6c4] text-[#1a1a1a]">
                      <td className="px-3 py-2 text-left text-[#8a7560]">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-3 py-2 text-left">{row.type}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#a6853d]">
                        {formatWon(row.amount)}
                      </td>
                      <td className="px-3 py-2 text-center">{row.status}</td>
                      <td className="px-3 py-2 text-left text-[#8a7560]">
                        {row.note || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
