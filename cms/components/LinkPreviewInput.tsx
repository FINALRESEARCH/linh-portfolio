import imageUrlBuilder from '@sanity/image-url'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {useMemo} from 'react'
import {type ObjectInputProps, useClient} from 'sanity'

type LinkPreviewValue = {
  title?: string
  description?: string
  image?: {
    asset?: {
      _ref?: string
    }
  }
}

const DEFAULT_PREVIEW_LABEL = 'opengraph.jpg (site default)'

export function LinkPreviewInput(props: ObjectInputProps) {
  const {renderDefault, value} = props
  const preview = (value ?? {}) as LinkPreviewValue
  const client = useClient({apiVersion: '2026-02-01'})

  const imageUrl = useMemo(() => {
    if (!preview.image?.asset) return null

    return imageUrlBuilder(client).image(preview.image).width(1200).height(630).fit('crop').url()
  }, [client, preview.image])

  return (
    <Stack space={4}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Link preview
          </Text>
          <Card overflow="hidden" radius={2} shadow={1}>
            <Box
              style={{
                aspectRatio: '1200 / 630',
                backgroundColor: 'var(--card-muted-bg-color)',
                backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              {!imageUrl ? (
                <Flex align="center" height="fill" justify="center" padding={4}>
                  <Text align="center" muted size={1}>
                    {DEFAULT_PREVIEW_LABEL}
                  </Text>
                </Flex>
              ) : null}
            </Box>
            <Box padding={3}>
              <Stack space={2}>
                <Text muted size={0} style={{textTransform: 'uppercase'}}>
                  {process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
                    (typeof window !== 'undefined' ? window.location.host : 'localhost:3000')}
                </Text>
                <Text size={1} weight="semibold">
                  {preview.title?.trim() || 'Page title will be used'}
                </Text>
                <Text muted size={1}>
                  {preview.description?.trim() || 'Description will fall back to page content.'}
                </Text>
              </Stack>
            </Box>
          </Card>
        </Stack>
      </Card>
      {renderDefault(props)}
    </Stack>
  )
}
