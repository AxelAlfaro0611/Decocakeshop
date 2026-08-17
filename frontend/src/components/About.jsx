import SocialLinks from './SocialLinks'
import './About.css'
import './SocialLinks.css'

export default function About() {
  return (
    <section className="about" id="nosotros">
      <div className="about__inner">
        <header className="about__header">
          <span className="about__eyebrow">Conócenos</span>
          <h2>¿Quiénes somos?</h2>
          <p className="about__intro">
            En <strong>DecoCake Shop</strong> somos una tienda especializada en
            productos, herramientas y accesorios para la repostería creativa y
            la decoración de postres.
          </p>
        </header>

        <div className="about__story">
          <p>
            Nacimos para acompañar a reposteros, emprendedores y amantes de la
            pastelería con productos prácticos, novedosos y accesibles que
            conviertan cada idea en una creación especial.
          </p>
          <p>
            Contamos con moldes, cortadores, acetatos, toppers, esténciles,
            sellos, utensilios y accesorios para distintas temporadas y
            celebraciones.
          </p>
          <p>
            Creemos que detrás de cada torta, postre o emprendimiento hay una
            historia, dedicación y creatividad. Por eso te brindamos variedad,
            buena atención y productos que impulsen tu pasión o negocio.
          </p>
        </div>

        <div className="about__pillars">
          <article className="about__card">
            <span className="about__number" aria-hidden="true">01</span>
            <h3>Misión</h3>
            <p>
              Ofrecer productos, herramientas y accesorios que permitan crear,
              decorar y emprender con mayor facilidad, brindando variedad,
              calidad, precios accesibles y una atención cercana.
            </p>
          </article>

          <article className="about__card">
            <span className="about__number" aria-hidden="true">02</span>
            <h3>Visión</h3>
            <p>
              Ser una marca referente en repostería creativa, reconocida por
              sus productos innovadores, variados y accesibles, y convertirnos
              en la primera opción de reposteros y emprendedores del país.
            </p>
          </article>
        </div>

        <blockquote className="about__motto">
          Todo lo que necesitas para darle forma a tu creatividad.
        </blockquote>

        <div className="about__follow">
          <p>Síguenos en nuestras redes</p>
          <SocialLinks variant="about" />
        </div>
      </div>
    </section>
  )
}
