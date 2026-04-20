interface ContentLayoutProps {
  children: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
  afterTitle?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  titleTrailing?: React.ReactNode
  enableCard?: boolean
  showFooter?: boolean
  headerMt?: string
  headerPx?: string
  mainPx?: string
  mainPy?: string
  titleClassName?: string
}

export default function ContentLayout({
  children,
  leading,
  trailing,
  afterTitle,
  title,
  description,
  titleTrailing,
  enableCard = false,
  titleClassName = 'text-2xl font-semibold text-foreground'
}: ContentLayoutProps) {
  const cardClass = 'bg-card rounded-lg shadow p-6'

  return (
    <div>
      {(title || leading || trailing) && (
        <header className="mt-4 px-4 sm:mt-8 sm:px-8">
          {title &&
            (titleTrailing ? (
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={titleClassName}>{title}</h1>
                  {description && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {description}
                    </p>
                  )}
                </div>
                <div className="ml-4">{titleTrailing}</div>
              </div>
            ) : (
              <div>
                <h1 className={titleClassName}>{title}</h1>
                {description && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {description}
                  </p>
                )}
              </div>
            ))}
          {afterTitle && <div className="mt-4">{afterTitle}</div>}
          {(leading || trailing) && (
            <div className="mt-4 flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="w-full sm:w-auto">{leading}</div>
              <div>{trailing}</div>
            </div>
          )}
        </header>
      )}

      <main className="px-4 pt-6 sm:px-8 sm:pt-8">
        {enableCard ? (
          <div className={cardClass}>{children}</div>
        ) : (
          <div className="mb-8">{children}</div>
        )}
      </main>
    </div>
  )
}
