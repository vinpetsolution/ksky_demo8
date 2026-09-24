"use client";

import { Fragment, useCallback, useState } from "react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/utils/classNames";
import { NOTICE_LIST } from "@/data/notices";

export type NoticeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function NoticeModal({ open, onClose }: NoticeModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = useCallback((id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
  }, []);

  const handleClose = useCallback(() => {
    setExpandedId(null);
    onClose();
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      showCloseButton
      className="w-full border-[#ead9b0]"
      contentClassName="!p-0 flex min-h-0 flex-col"
      headerClassName="px-5 py-4 items-start justify-start bg-[radial-gradient(circle_at_top,#f3e6c4,#ffffff_70%)]"
      title={
        <>
          <div className="w-full flex flex-col gap-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#a6853d]">
              KSKY SOLUTION NOTICE
            </p>
            <h2 className="text-xl font-bold text-[#1a1a1a]">공지사항</h2>
            <p className="text-xs text-[#8a7560]">중요 공지와 업데이트 안내를 확인하세요.</p>
          </div>
        </>
      }
    >
      <div className="p-5">
        <div className="overflow-hidden rounded-xl border border-[#ead9b0] bg-[#fbf7f0]">
          {NOTICE_LIST.length === 0 ? (
            <div className="py-8 text-center text-[#8a7560]">공지사항이 없습니다.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="hidden w-full min-w-150 text-sm md:table">
                  <thead>
                    <tr className="bg-linear-to-r from-[#f3e0b0] to-[#c6a15b] text-[#1a1a1a]">
                      <th className="w-17.5 px-3 py-2 text-center">No.</th>
                      <th className="px-3 py-2 text-left">제목</th>
                      <th className="w-35 px-3 py-2 text-center">작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NOTICE_LIST.map((row) => {
                      const isOpen = expandedId === row.id;
                      return (
                        <Fragment key={row.id}>
                          <tr
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleRow(row.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleRow(row.id);
                              }
                            }}
                            className={cn(
                              "cursor-pointer border-t border-[#ead9b0] transition",
                              isOpen ? "bg-[#f8f1df]" : "hover:bg-[#f8f1df]"
                            )}
                          >
                            <td className="px-3 py-3 text-center text-[#8a7560]">
                              {row.no}
                            </td>
                            <td className="px-3 py-3 text-left">
                              <div className="flex items-center justify-between gap-3">
                                <div className="font-semibold text-[#1a1a1a]">
                                  {row.title}
                                </div>
                                <span className="text-xs text-[#a6853d]">
                                  {isOpen ? "닫기" : "보기"}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-center text-[#8a7560]">
                              {row.date}
                            </td>
                          </tr>
                          {isOpen ? (
                            <tr
                              className="border-t border-[#f3e6c4] bg-[#f8f1df]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <td colSpan={3} className="px-4 py-4">
                                <div className="text-sm text-[#1a1a1a] leading-relaxed">
                                  {row.content}
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ul className="md:hidden min-w-75">
                {NOTICE_LIST.map((row) => {
                  const isOpen = expandedId === row.id;
                  return (
                    <li key={row.id} className="border-t border-[#ead9b0] first:border-t-0">
                      <button
                        type="button"
                        onClick={() => toggleRow(row.id)}
                        className="flex w-full items-start justify-between gap-2 px-3 py-3 text-left transition hover:bg-[#f8f1df]"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#8a7560]">No. {row.no}</span>
                            <p className="text-xs text-[#8a7560]">{row.date}</p>
                          </div>
                          <div className="mt-0.5 text-sm font-medium text-[#1a1a1a]">
                            {row.title}
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-[#a6853d]">
                          {isOpen ? "닫기" : "보기"}
                        </span>
                      </button>
                      {isOpen ? (
                        <div className="border-t border-[#f3e6c4] bg-[#f8f1df] px-4 py-4">
                          <div className="text-sm text-[#1a1a1a] leading-relaxed">
                            {row.content}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
