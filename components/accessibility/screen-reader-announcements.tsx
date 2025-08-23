"use client";

import { useEffect, useRef } from "react";

interface ScreenReaderAnnouncementsProps {
  announcements: string[];
  priority?: "polite" | "assertive";
}

export function ScreenReaderAnnouncements({
  announcements,
  priority = "polite",
}: ScreenReaderAnnouncementsProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcements.length > 0 && announcementRef.current) {
      const latestAnnouncement = announcements[announcements.length - 1];
      announcementRef.current.textContent = latestAnnouncement || "";
    }
  }, [announcements]);

  return (
    <div
      ref={announcementRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      role="status"
    />
  );
}
