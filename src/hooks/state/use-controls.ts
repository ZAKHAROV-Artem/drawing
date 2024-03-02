import { Tool, Nullable } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type State = {
  color: string;
  size: number;
  showPicker: boolean;
  tool: Tool;
};

type Actions = {
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setShowPicker: (showPicker: boolean) => void;
  setTool: (tool: Tool) => void;
};

export const useControls = create<State & Actions>()(
  immer((set) => ({
    color: "#000000",
    size: 3,
    showPicker: false,
    tool: Tool.Pen,
    setColor: (color) =>
      set((state) => {
        state.color = color;
      }),
    setSize: (size) =>
      set((state) => {
        state.size = size;
      }),
    setShowPicker: (showPicker) =>
      set((state) => {
        state.showPicker = showPicker;
      }),
    setTool: (tool) =>
      set((state) => {
        state.tool = tool;
      }),
  })),
);
