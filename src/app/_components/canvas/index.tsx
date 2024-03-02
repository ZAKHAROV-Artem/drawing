"use client";

import { useDraw } from "@/hooks/use-draw";
import { Nullable } from "@/types";
import { useRef } from "react";

export default function Canvas() {
  const ref = useRef<Nullable<HTMLCanvasElement>>(null);
  useDraw({ ref });
  return <canvas ref={ref} />;
}
