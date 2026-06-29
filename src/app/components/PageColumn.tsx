import { ReactNode } from "react";

interface PageColumnProps {
  children: ReactNode;
  style?: React.CSSProperties;
  bg?: string;
  noBorderTop?: boolean;
}

export function PageColumn({ children, style, bg, noBorderTop }: PageColumnProps) {
  return (
    <div style={{ background: bg || "transparent", ...style }}>
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          borderLeft: "1px solid #e0e0e0",
          borderRight: "1px solid #e0e0e0",
          borderTop: noBorderTop ? "none" : "1px solid #e0e0e0",
        }}
      >
        {children}
      </div>
    </div>
  );
}
