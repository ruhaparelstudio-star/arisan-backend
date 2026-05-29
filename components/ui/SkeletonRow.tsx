export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "13px 14px" }}>
          <div
            className="sk"
            style={{
              height: 14,
              width: i === 0 ? "80%" : i === cols - 1 ? "60px" : "70%",
              borderRadius: 7,
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonRows({ count = 5, cols = 5 }: { count?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} cols={cols} />
      ))}
    </>
  );
}
