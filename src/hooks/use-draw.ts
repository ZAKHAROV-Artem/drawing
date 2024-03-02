import { Nullable, Tool } from "@/types";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useControls } from "./state";
import { useShallow } from "zustand/react/shallow";

export const useDraw = ({
  ref,
}: {
  ref: MutableRefObject<Nullable<HTMLCanvasElement>>;
}) => {
  const { color, size, tool } = useControls(
    useShallow((state) => ({
      color: state.color,
      size: state.size,
      tool: state.tool,
    })),
  );
  const [snapshot, setSnaphsot] = useState<Nullable<ImageData>>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [ctx, setCtx] = useState<Nullable<CanvasRenderingContext2D>>(null);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const drawSquare = useCallback(
    (x: number, y: number) => {
      if (!ctx) return;
      ctx.fillRect(
        x,
        y,
        prevMousePos.current.x - x,
        prevMousePos.current.y - y,
      );
    },
    [ctx],
  );
  const drawCirqle = useCallback(
    (x: number, y: number) => {
      if (!ctx) return;
      ctx.beginPath();
      const radius = Math.sqrt(
        Math.pow(x - prevMousePos.current.x, 2) +
          Math.pow(y - prevMousePos.current.y, 2),
      );
      ctx.arc(
        prevMousePos.current.x,
        prevMousePos.current.y,
        radius,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    },
    [ctx],
  );

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing || !ctx) return;
      if (snapshot) ctx.putImageData(snapshot, 0, 0);

      if (tool === Tool.Pen || tool === Tool.Eraser) {
        ctx.strokeStyle = tool === Tool.Pen ? color : "#FFF";
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      } else if (tool === Tool.Square) {
        drawSquare(e.x, e.y);
      } else if (tool === Tool.Cirqle) {
        drawCirqle(e.x, e.y);
      }
    },
    [ctx, isDrawing, tool, color, snapshot, drawSquare, drawCirqle],
  );
  const mouseDown = useCallback(
    (e: MouseEvent) => {
      if (!ctx) return;
      setIsDrawing(true);
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = "round";
      prevMousePos.current = { x: e.x, y: e.y };
      setSnaphsot(
        ctx.getImageData(0, 0, window.innerWidth, window.innerHeight),
      );
    },
    [ctx, color, size],
  );
  const mouseUp = (e: MouseEvent) => {
    setIsDrawing(false);
  };
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    window.addEventListener("resize", setSize);
    return () => {
      window.removeEventListener("resize", setSize);
    };
  }, [ref]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    window.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("mouseup", mouseUp);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("mouseup", mouseUp);
    };
  }, [ref, mouseMove, mouseDown]);

  return { isDrawing, ctx };
};
