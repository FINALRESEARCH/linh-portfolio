import imageUrlBuilder from '@sanity/image-url'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {useMemo} from 'react'
import {type ObjectInputProps, useClient} from 'sanity'

type SiteIconsValue = {
  favicon?: {
    asset?: {
      _ref?: string
    }
  }
  appleTouchIcon?: {
    asset?: {
      _ref?: string
    }
  }
}

function getImageUrl(
  client: ReturnType<typeof useClient>,
  image: SiteIconsValue['favicon'],
  width: number,
  height: number,
) {
  if (!image?.asset) return null

  return imageUrlBuilder(client).image(image).width(width).height(height).fit('crop').url()
}

export function SiteIconsInput(props: ObjectInputProps) {
  const {renderDefault, value} = props
  const icons = (value ?? {}) as SiteIconsValue
  const client = useClient({apiVersion: '2026-02-01'})

  const faviconUrl = useMemo(
    () => getImageUrl(client, icons.favicon, 32, 32),
    [client, icons.favicon],
  )
  const appleTouchIconUrl = useMemo(
    () => getImageUrl(client, icons.appleTouchIcon, 180, 180),
    [client, icons.appleTouchIcon],
  )

  return (
    <Stack space={4}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Site icons
          </Text>
          <Flex gap={4} wrap="wrap">
            <Stack space={2}>
              <Text muted size={1}>
                Favicon
              </Text>
              <Card padding={3} radius={2} shadow={1} style={{width: 96}}>
                <Flex align="center" justify="center">
                  <Box
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      backgroundColor: 'var(--card-muted-bg-color)',
                      backgroundImage: faviconUrl ? `url(${faviconUrl})` : undefined,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  />
                </Flex>
                {!faviconUrl ? (
                  <Text align="center" muted size={0} style={{marginTop: 8}}>
                    favicon.png
                  </Text>
                ) : null}
              </Card>
            </Stack>
            <Stack space={2}>
              <Text muted size={1}>
                Apple touch icon
              </Text>
              <Card padding={3} radius={2} shadow={1} style={{width: 96}}>
                <Flex align="center" justify="center">
                  <Box
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      backgroundColor: 'var(--card-muted-bg-color)',
                      backgroundImage: appleTouchIconUrl ? `url(${appleTouchIconUrl})` : undefined,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  />
                </Flex>
                {!appleTouchIconUrl ? (
                  <Text align="center" muted size={0} style={{marginTop: 8}}>
                    webclip.png
                  </Text>
                ) : null}
              </Card>
            </Stack>
          </Flex>
        </Stack>
      </Card>
      {renderDefault(props)}
    </Stack>
  )
}
