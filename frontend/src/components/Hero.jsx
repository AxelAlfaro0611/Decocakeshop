import { useEffect, useState } from 'react'
import logo from '../assets/logo.jpeg'
import { fetchProducts } from '../api/client'
import SocialLinks from './SocialLinks'
import './Hero.css'
import './SocialLinks.css'

const SLIDE_MS = 4500

export default function Hero() {
  const [slides, setSlides] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchProducts({ pageSize: 100, featured: true })
      .then((products) => {
        if (cancelled) return
        const withImage = products
          .map((product) => ({
            id: product.id,
            name: product.name,
            src: product.image_url || product.image,
          }))
          .filter((item) => Boolean(item.src))
        setSlides(withImage)
        setIndex(0)
      })
      .catch(() => {
        if (!cancelled) {
          setSlides([])
          setIndex(0)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (slides.length === 0) {
      setIndex(0)
      return
    }
    setIndex((current) => (current >= slides.length ? 0 : current))
  }, [slides.length])

  useEffect(() => {
    if (slides.length < 2) return undefined

    let timeoutId = 0
    let cancelled = false

    const tick = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return
        if (document.visibilityState === 'hidden') return
        setIndex((current) => (current + 1) % slides.length)
      }, SLIDE_MS)
    }

    const onVisibility = () => {
      window.clearTimeout(timeoutId)
      if (document.visibilityState === 'visible' && !cancelled) {
        tick()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)
    if (document.visibilityState === 'visible') {
      tick()
    }

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [slides.length, index])

  const removeBrokenSlide = (id) => {
    setSlides((current) => current.filter((slide) => slide.id !== id))
  }

  const hasSlides = slides.length > 0
  const safeIndex = hasSlides ? index % slides.length : 0

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-brand">
      <div className="hero__media" aria-hidden="true">
        {hasSlides ? (
          slides.map((slide, slideIndex) => (
            <div
              key={slide.id}
              className={`hero__slide ${slideIndex === safeIndex ? 'is-active' : ''}`}
            >
              <img className="hero__slide-fill" src={slide.src} alt="" />
              <img
                className="hero__slide-img"
                src={slide.src}
                alt=""
                loading="eager"
                decoding="async"
                onError={() => removeBrokenSlide(slide.id)}
              />
            </div>
          ))
        ) : (
          <div className="hero__fallback" />
        )}
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <img
          id="hero-brand"
          className="hero__logo"
          src={logo}
          alt="Deco Cake Shop"
          width={480}
          height={480}
        />
        <h1 className="hero__title">Accesorios que elevan cada creación</h1>
        <p className="hero__lead">
          Productos y herramientas de repostería para crear en casa o en tu
          negocio: emprendedoras y amantes de la pastelería.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#catalogo">
            Ver catálogo
          </a>
          <a className="btn btn--ghost" href="#nosotros">
            Conocer más
          </a>
        </div>
        <SocialLinks variant="hero" />
      </div>

      {slides.length > 1 ? (
        <div className="hero__dots" role="tablist" aria-label="Productos destacados">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={slideIndex === safeIndex}
              aria-label={slide.name}
              className={slideIndex === safeIndex ? 'is-active' : ''}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
