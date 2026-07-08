import {PortableText as PortableTextRenderer} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'

type PortableTextProps = {
  value?: PortableTextBlock[]
  className?: string
}

export function PortableText({value, className}: PortableTextProps) {
  if (!value?.length) return null

  return (
    <div className={className}>
      <PortableTextRenderer
        value={value}
        components={{
          block: {
            normal: ({children}) => <p>{children}</p>,
          },
          marks: {
            strong: ({children}) => <strong>{children}</strong>,
            link: ({children, value: link}) => (
              <a href={link?.href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          },
        }}
      />
    </div>
  )
}
