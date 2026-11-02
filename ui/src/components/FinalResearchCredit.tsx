'use client'

import {useEffect, useRef} from 'react'

const SVG_NS = 'http://www.w3.org/2000/svg'

/** FINAL RESEARCH credit link — hover/tap draws corner lines + a viewport frame. */
export function FinalResearchCredit({className}: {className?: string}) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return
    const hover = link.querySelector<HTMLElement>('.final-research-hover')
    const def = link.querySelector<HTMLElement>('.final-research-default')
    if (!hover) return
    let svg: SVGSVGElement | null = null
    let isHovering = false

    const themeColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || '#333'
    const isMobile = () => window.innerWidth <= 724 || 'ontouchstart' in window

    const draw = () => {
      svg?.remove()
      requestAnimationFrame(() => {
        const r = hover.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        const c = themeColor()
        const screen = [
          {x: 0, y: 0},
          {x: vw, y: 0},
          {x: 0, y: vh},
          {x: vw, y: vh},
        ]
        const block = [
          {x: r.left, y: r.top},
          {x: r.right, y: r.top},
          {x: r.left, y: r.bottom},
          {x: r.right, y: r.bottom},
        ]
        svg = document.createElementNS(SVG_NS, 'svg')
        svg.setAttribute('class', 'final-research-corner-lines')
        svg.style.cssText =
          'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;' +
          'z-index:2147483647;overflow:visible;'
        svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
        svg.setAttribute('preserveAspectRatio', 'none')
        svg.setAttribute('aria-hidden', 'true')
        screen.forEach((s, i) => {
          const l = document.createElementNS(SVG_NS, 'line')
          l.setAttribute('x1', String(s.x))
          l.setAttribute('y1', String(s.y))
          l.setAttribute('x2', String(block[i].x))
          l.setAttribute('y2', String(block[i].y))
          l.setAttribute('stroke', c)
          l.setAttribute('stroke-width', '1')
          svg!.appendChild(l)
        })
        const frame = [
          {x: 0, y: 0, w: vw, h: 1.5},
          {x: 0, y: vh - 1.5, w: vw, h: 1.5},
          {x: 0, y: 0, w: 1.5, h: vh},
          {x: vw - 1.5, y: 0, w: 1.5, h: vh},
        ]
        frame.forEach((f) => {
          const rect = document.createElementNS(SVG_NS, 'rect')
          rect.setAttribute('x', String(f.x))
          rect.setAttribute('y', String(f.y))
          rect.setAttribute('width', String(f.w))
          rect.setAttribute('height', String(f.h))
          rect.setAttribute('fill', c)
          svg!.appendChild(rect)
        })
        document.body.appendChild(svg)
      })
    }
    const remove = () => {
      svg?.remove()
      svg = null
    }
    const showHover = () => {
      if (def) def.style.visibility = 'hidden'
      hover.style.opacity = '1'
      hover.style.visibility = 'visible'
    }
    const hideHover = () => {
      if (def) def.style.visibility = 'visible'
      hover.style.opacity = '0'
      hover.style.visibility = 'hidden'
    }

    const onClick = (e: MouseEvent) => {
      if (!isMobile()) return
      e.preventDefault()
      showHover()
      draw()
      setTimeout(() => {
        remove()
        hideHover()
        window.location.href = link.href
      }, 1500)
    }
    const onEnter = () => {
      isHovering = true
      if (!isMobile()) draw()
    }
    const onLeave = () => {
      isHovering = false
      if (!isMobile()) remove()
    }
    const onReflow = () => {
      if (isHovering && svg) draw()
    }

    link.addEventListener('click', onClick)
    link.addEventListener('mouseenter', onEnter)
    link.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, {passive: true})

    return () => {
      link.removeEventListener('click', onClick)
      link.removeEventListener('mouseenter', onEnter)
      link.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow)
      remove()
    }
  }, [])

  return (
    <div className={`final-research-credit ${className ?? ''}`}>
      <a id="final-research" ref={linkRef} href="https://finalresearch.org" target="_blank" rel="noopener">
        <span className="final-research-default">Website by FINAL RESEARCH</span>
        <span className="final-research-hover">FINALRESEARCH.ORG</span>
      </a>
    </div>
  )
}
