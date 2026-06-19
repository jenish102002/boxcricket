export function Skeleton({ className = '', ...props }) {
  return <div className={`skeleton ${className}`} {...props} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <div className="card">
      <Skeleton className="h-48 w-full rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}
