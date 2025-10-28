import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, Star, Check } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import type { ApplicantCardProps } from "../types/kanban.types";

export function ApplicantCard({
  id,
  name,
  time,
  rating,
  isDragging = false,
  isSelected = false,
  isSelectionMode = false,
  onLongPress,
  onToggleSelect,
}: ApplicantCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id });

  useEffect(() => {
    const checkMobile = () => {
      const hasTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(
        hasTouchScreen && (isMobileUserAgent || window.innerWidth < 768)
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 150ms ease",
    opacity: sortableIsDragging ? 0.5 : 1,
  };

  const handleTouchStart = () => {
    if (!isMobile || !onLongPress) return;

    const timer = setTimeout(() => {
      onLongPress(id);
    }, 500); // 500ms long press

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = () => {
    if (isMobile && isSelectionMode && onToggleSelect) {
      onToggleSelect(id);
    } else if (isMobile && !isSelectionMode && onLongPress) {
      onLongPress(id);
    }
  };

  const cardProps = isMobile
    ? {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onClick: handleClick,
      }
    : {
        ...attributes,
        ...listeners,
      };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...cardProps}
      className={`
        bg-white p-3 rounded-lg border mb-2 transition-all duration-200
        ${!isMobile ? "cursor-move hover:shadow-md" : "cursor-pointer"}
        ${isDragging ? "rotate-1 shadow-lg" : ""}
        ${sortableIsDragging ? "z-50" : ""}
        ${isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""}
        ${isSelectionMode && !isSelected ? "opacity-70" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        {isMobile && isSelectionMode && (
          <div
            className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"}
          `}
          >
            {isSelected && <Check className="h-3 w-3 text-white" />}
          </div>
        )}

        <Avatar className="h-8 w-8">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} alt={name} />
          <AvatarFallback className="text-xs">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
