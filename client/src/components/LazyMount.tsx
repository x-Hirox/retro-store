import { useEffect, useRef, useState, type ReactNode } from "react";

export default function LazyMount({
  children,
  rootMargin = "280px",
}: {
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return <div ref={ref}>{show ? children : null}</div>;
}
