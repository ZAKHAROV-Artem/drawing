"use client";
import { useRef } from "react";
import { FaPen, FaRegSquare, FaRegCircle, FaEraser } from "react-icons/fa";
import { useOnClickOutside } from "usehooks-ts";
import { Tool, Nullable } from "@/types";
import Block from "@uiw/react-color-block";
import { useControls } from "@/hooks/state";
import { cn } from "@/libs/utils";
import { FaMinus, FaPlus } from "react-icons/fa6";

export default function ControlPanel() {
  const {
    color,
    showPicker,
    tool,
    size,
    setSize,
    setColor,
    setShowPicker,
    setTool,
  } = useControls();
  const ref = useRef<Nullable<HTMLDivElement>>(null);

  const toggleColorPicker = () => {
    setShowPicker(!showPicker);
  };
  const hideColorPicker = () => {
    setShowPicker(false);
  };
  useOnClickOutside(ref, hideColorPicker);

  return (
    <div className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-x-2 rounded-xl">
      <div className="flex items-center justify-center gap-x-2 rounded-xl border bg-white p-2 shadow-md">
        <div
          onClick={() => setTool(Tool.Pen)}
          className={cn("grid h-8 w-8 place-content-center rounded-md", {
            "bg-gray-100": tool === Tool.Pen,
          })}
        >
          <FaPen />
        </div>
        <div
          onClick={() => setTool(Tool.Square)}
          className={cn("grid h-8 w-8 place-content-center rounded-md", {
            "bg-gray-100": tool === Tool.Square,
          })}
        >
          <FaRegSquare />
        </div>
        <div
          onClick={() => setTool(Tool.Cirqle)}
          className={cn("grid h-8 w-8 place-content-center rounded-md", {
            "bg-gray-100": tool === Tool.Cirqle,
          })}
        >
          <FaRegCircle />
        </div>
        <div
          onClick={() => setTool(Tool.Eraser)}
          className={cn("grid h-8 w-8 place-content-center rounded-md", {
            "bg-gray-100": tool === Tool.Eraser,
          })}
        >
          <FaEraser />
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-2 rounded-xl border bg-white p-2 shadow-md">
        <div className="relative">
          <div
            onClick={toggleColorPicker}
            className="h-8 w-8 rounded-md border"
            style={{ backgroundColor: color }}
          />
          {showPicker && (
            <div className="absolute left-1/2 top-[140%] z-10 -translate-x-1/2">
              <div className="rounded-lg border-2 p-1">
                <Block
                  ref={ref}
                  color={color}
                  onChange={(color) => {
                    setColor(color.hex);
                  }}
                />{" "}
              </div>
            </div>
          )}
        </div>
        <div className="flex">
          <div
            className="grid h-8 w-8 place-content-center rounded-md"
            onClick={() => size < 55 && setSize(size + 1)}
          >
            <FaPlus />
          </div>
          <div className="grid h-8 w-8 place-content-center rounded-md border">
            {size}
          </div>
          <div
            className="grid h-8 w-8 place-content-center rounded-md"
            onClick={() => size > 1 && setSize(size - 1)}
          >
            <FaMinus />
          </div>
        </div>
      </div>
    </div>
  );
}
