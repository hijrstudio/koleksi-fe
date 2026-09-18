interface PlusDividerProps {
  /** Also add a center "+" mark, aligned with the centerGuide line at 50% */
  center?: boolean;
}

export default function PlusDivider({ center = false }: PlusDividerProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-border-light dark:bg-border-dark"
    >
      <span
        className="plus-divider-mark"
        style={{ left: "calc(var(--gutter) - 20px)" }}
      />
      {center && (
        <span
          className="plus-divider-mark hidden lg:block"
          style={{ left: "calc(50% - 20px)" }}
        />
      )}
      <span
        className="plus-divider-mark"
        style={{ right: "calc(var(--gutter) - 20px)" }}
      />
    </div>
  );
}
