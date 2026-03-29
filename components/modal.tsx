"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

function getFocusable(container: HTMLElement) {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
  );
  return Array.from(elements).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) return;
        const current = document.activeElement as HTMLElement | null;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        const isShift = (e as KeyboardEvent).shiftKey;

        if (!current || !panelRef.current.contains(current)) {
          e.preventDefault();
          first.focus();
          return;
        }

        if (isShift && current === first) {
          e.preventDefault();
          last.focus();
          return;
        }
        if (!isShift && current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative mx-auto flex h-full max-w-3xl items-center px-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title ?? "Dialog"}
              className={cn(
                "w-full rounded-2xl border border-white/10 bg-bg/70 p-6 shadow-2xl backdrop-blur-2xl",
                className
              )}
              ref={(node) => {
                panelRef.current = node;
              }}
              initial={{ y: 14, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onAnimationComplete={() => {
                if (!panelRef.current) return;
                const focusable = getFocusable(panelRef.current);
                (focusable[0] ?? panelRef.current).focus?.();
              }}
              tabIndex={-1}
            >
              {title ? <div className="mb-4 text-lg font-semibold text-white">{title}</div> : null}
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
