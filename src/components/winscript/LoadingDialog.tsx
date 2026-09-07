import { AnimatePresence, motion } from "framer-motion";

export function LoadingDialog({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="grid h-20 w-20 place-items-center rounded-[20px] bg-muted ring-1 ring-border"
          >
            <svg className="h-11 w-11 animate-spin" viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="5"
                className="stroke-secondary"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="90 160"
                className="stroke-neon"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
