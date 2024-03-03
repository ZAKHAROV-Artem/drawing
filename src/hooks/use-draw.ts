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
    const drawSquare = (x: number, y: number) => {
      if (!ctx) return;
      ctx.fillRect(
        x,
        y,
        prevMousePos.current.x - x,
        prevMousePos.current.y - y,
      );
    };
    const drawCirqle = (x: number, y: number) => {
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
    };
    const mouseMove = (e: TouchEvent | MouseEvent) => {
      if (!isDrawing || !ctx) return;
      if (snapshot) ctx.putImageData(snapshot, 0, 0);

      if (tool === Tool.Pen || tool === Tool.Eraser) {
        ctx.strokeStyle = tool === Tool.Pen ? color : "#FFF";
        if (e instanceof TouchEvent) {
          ctx.lineTo(e.touches[0].clientX, e.touches[0].clientY);
        } else {
          ctx.lineTo(e.x, e.y);
        }
        ctx.stroke();
      } else if (tool === Tool.Square) {
        if (e instanceof TouchEvent) {
          drawSquare(e.touches[0].clientX, e.touches[0].clientY);
        } else {
          drawSquare(e.x, e.y);
        }
      } else if (tool === Tool.Cirqle) {
        if (e instanceof TouchEvent) {
          drawCirqle(e.touches[0].clientX, e.touches[0].clientY);
        } else {
          drawCirqle(e.x, e.y);
        }
      }
    };
    const mouseUp = () => {
      setIsDrawing(false);
    };
    const mouseDown = (e: TouchEvent | MouseEvent) => {
      if (!ctx) return;
      setIsDrawing(true);
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineCap = "round";
      if (e instanceof TouchEvent) {
        prevMousePos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        prevMousePos.current = { x: e.x, y: e.y };
      }
      setSnaphsot(
        ctx.getImageData(0, 0, window.innerWidth, window.innerHeight),
      );
    };
    window.addEventListener("touchmove", mouseMove);
    window.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", mouseDown);
    canvas.addEventListener("touchstart", mouseDown, {
      passive: true,
    });
    canvas.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("touchend", mouseUp);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("touchmove", mouseMove);
      canvas.removeEventListener("mousedown", mouseDown);
      canvas.removeEventListener("touchstart", mouseDown);
      canvas.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("touchend", mouseUp);
    };
  }, [ref, isDrawing, color, size, ctx, snapshot, tool]);

  return { isDrawing, ctx };
};
