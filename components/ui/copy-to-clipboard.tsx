"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  successMessage?: string;
}

export function CopyToClipboard({
  text,
  children,
  className,
  showIcon = true,
  successMessage = "Copied to clipboard!",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className={cn(
          "relative cursor-pointer transition-all duration-200",
          "hover:scale-105 active:scale-95",
          className
        )}
        aria-label={`Copy ${text} to clipboard`}
      >
        {children}
        {showIcon && (
          <motion.div
            className="ml-2 inline-flex"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.2 }}
                >
                  <Copy className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-foreground text-background px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap shadow-lg">
              {successMessage}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
