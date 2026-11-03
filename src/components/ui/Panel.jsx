export default function Panel({ as: Element = "div", className = "", children }) {
  return (
    <Element className={`min-w-0 rounded-xl border border-white/10 bg-panel ${className}`}>
      {children}
    </Element>
  );
}
