const variants = {
  primary: "bg-accent text-white hover:bg-pink-light",
  secondary: "border border-white/10 bg-white/5 text-white hover:bg-white/10",
  outline: "border border-white/10 bg-white/5 text-plum hover:bg-white/10",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 text-[10px] font-bold transition duration-150 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
