import { asset, autonomyDetails, heroSlides, redefiningCards, sourceUrl } from "./data";
import {
  autonomyLine,
  autonomyRobot,
  blueShade,
  ellipse,
  futureRobotics,
  heroHome1,
  heroHome2,
  heroHome3,
  heroHome4,
  redefiningRobot,
  target3,
} from "./pictures";
import { LineElement, Picture, PrimaryButton } from "./primitives";

const heroPictures = [heroHome1, heroHome2, heroHome3, heroHome4];

function ProgressBar({ id, variant }: { id: string; variant: "mobile-horizontal transition" | "desktop-vertical" }) {
  return (
    <div className={`bar ${variant}`} id={id}>
      <div className="loaded" />
      <div className="glow" />
    </div>
  );
}

function Ellipse() {
  return (
    <img
      src={ellipse.src}
      srcSet={ellipse.srcSet}
      sizes={ellipse.sizes}
      alt=""
      loading="lazy"
      decoding="async"
      width={ellipse.width}
      height={ellipse.height}
      className="ellipse"
    />
  );
}

export function HeroSection() {
  return (
    <section id="hero-section">
      <div className="hero-content">
        {heroSlides.map((slide, index) => (
          <div key={slide.title} className={index === 0 ? "content active" : "content"}>
            <LineElement> {slide.eyebrow} </LineElement>
            <h1 className="title h1">{slide.title}</h1>
            <p className="paragraph-1">{slide.text}</p>
            <PrimaryButton href={sourceUrl(slide.href)}>{slide.cta}</PrimaryButton>
          </div>
        ))}
      </div>
      <div className="splide" id="hero-splide">
        <div className="splide__arrows">
          <button className="splide__arrow splide__arrow--prev" type="button">
            <img src={asset("/icons/arrow_right.svg")} alt="Arrow left" width={22} height={17} />
          </button>
          <button className="splide__arrow splide__arrow--next" type="button">
            <img src={asset("/icons/arrow_right.svg")} alt="Arrow right" width={22} height={17} />
          </button>
        </div>
        <div className="splide__track">
          <div className="splide__list">
            {heroPictures.map((picture, index) => (
              <div key={picture.src} className="splide__slide">
                <Picture data={picture} alt="Ai Robots" className="shot" fetchPriority="high" loading={index === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-indicator">
          <div className="carousel-steps">
            {heroSlides.map((slide) => (
              <button key={slide.step} type="button">
                {slide.step}
              </button>
            ))}
          </div>
          <div className="carousel-line">
            <span />
          </div>
        </div>
      </div>
      <div className="scroll-down">
        scroll
        <img src={asset("/icons/scroll_down.svg")} alt="Scroll down" width={23} height={37} />
        down
      </div>
    </section>
  );
}

export function AutonomySection() {
  return (
    <section id="autonomy-section">
      <div className="h2-wrapper">
        <h2 className="h1">advanced autonomy</h2>
      </div>
      <div className="autonomy-robot">
        <Picture data={autonomyRobot} alt="Advanced autonomy" fetchPriority="high" />
      </div>
      <img src={blueShade.src} alt="" loading="lazy" decoding="async" width={blueShade.width} height={blueShade.height} className="blue-shade" />
      <Ellipse />
      <div className="autonomy-details">
        {autonomyDetails.map((detail) => (
          <div key={detail.title} className="detail">
            <img className="img" src={asset(detail.icon)} alt="" loading="lazy" width={80} height={80} />
            <p>{detail.title}</p>
            <span>{detail.text}</span>
            <img
              src={autonomyLine.src}
              alt=""
              loading="lazy"
              decoding="async"
              width={autonomyLine.width}
              height={autonomyLine.height}
              className="autonomy-line"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RedefiningSection() {
  return (
    <section id="redefining-section">
      <div className="head">
        <div className="h2-wrapper">
          <h2 className="h1">redefining robotics</h2>
        </div>
        <p>Value for Every Market.</p>
      </div>
      <div className="info">
        <h2>Next-Gen Companion</h2>
        <span> Your Embodied AI Partner. </span>
        <p>
          More than a gadget, our consumer robots are intelligent creatures that bring cutting-edge Next-Gen Companion technology into your
          home for play, learning, and connection.
        </p>
        <div className="splide">
          <div className="splide__track">
            <div className="splide__list">
              {redefiningCards.map((card) => (
                <div key={card.title} className="splide__slide with-border">
                  <strong className="shade" />
                  <strong className="shade" />
                  <img src={asset(card.icon)} alt="" className="icon" loading="lazy" width={80} height={80} />
                  <span> {card.title} </span>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bar-wrapper">
          <ProgressBar id="redefining-progress-bar" variant="mobile-horizontal transition" />
        </div>
      </div>
      <div className="redefining-robot">
        <Picture data={redefiningRobot} alt="Redefining robotics" className="img" fetchPriority="high" />
        <Ellipse />
      </div>
    </section>
  );
}

export function TargetSection() {
  return (
    <section id="target-section">
      <div className="head">
        <div className="h2-wrapper overflow-hidden">
          <h2 className="h1">
            Targeted <br />
            Inspections
          </h2>
        </div>
        <span> Industrial Manufacturing </span>
        <div className="progress">
          <ProgressBar id="target-progress-bar" variant="desktop-vertical" />
          <strong />
          <div className="steps-container">
            <div className="steps">
              <span>Eliminating Blind Spots</span>
              <span>Close-Up Inspection </span>
              <span>Precise Temperature Measurement</span>
            </div>
          </div>
        </div>
      </div>
      <div className="splide">
        <div className="splide__track">
          <div className="list splide__list">
            <div className="item splide__slide">
              <p>
                Eliminating Blind Spots and <br className="br-mobile" /> Ensuring Full Coverage
              </p>
              <span>
                Traditional inspection methods often leave critical areas unchecked. Our quadruped robots ensure full-area, high-frequency
                inspections with zero blind spots by dramatically boosting inspection coverage density and data continuity. The intelligent
                patrol system captures dynamic hazards in complex settings with pinpoint accuracy, providing a complete picture of asset
                health.
              </span>
              <video className="media" preload="none" muted loop playsInline width={1280} height={720}>
                <source src={asset("/videos/target_1.mp4")} type="video/mp4" />
              </video>
            </div>
            <div className="item splide__slide">
              <p>Close-Up Inspection of Switch Meters</p>
              <span>
                Achieving accurate, close-up readings of analog switch meters is a common challenge. Our robots utilize No-Model Meter
                Recognition, an enhanced capability that automatically pinpoints meter locations, performs semantic segmentation of
                measurement ranges, and corrects distortion. This allows for the automatic reading of values without the need for manual
                calibration or pre-trained models.
              </span>
              <video className="media" preload="none" muted loop playsInline width={1280} height={720}>
                <source src={asset("/videos/target_2-min.webm")} type="video/webm" />
                <source src={asset("/videos/target_2-min.mp4")} type="video/mp4" />
              </video>
            </div>
            <div className="item splide__slide">
              <p>
                Precise Temperature Measurement <br className="br-mobile" /> of Dry Reactors
              </p>
              <span>
                Monitoring the thermal integrity of critical equipment like dry reactors is essential for preventing catastrophic failure.
                The integrated Infrared Thermography system, combined with AI vision, delivers 24/7 real-time scanning for temperature
                anomalies. This high-precision thermal data allows for proactive maintenance and immediate identification of overheating
                components, safeguarding critical infrastructure
              </span>
              <Picture data={target3} alt="Precise Temperature Measurement" className="media" fetchPriority="low" />
            </div>
          </div>
        </div>
      </div>
      <div className="bar-wrapper">
        <ProgressBar id="target-progress-bar-mob" variant="mobile-horizontal transition" />
      </div>
    </section>
  );
}

export function FutureSection() {
  return (
    <section id="future-section">
      <Picture data={futureRobotics} alt="Future Robotics" className="bck" fetchPriority="high" />
      <h2 className="h1">
        Step into the Future <br className="br-mobile br-tablet" /> of <br className="br-desktop" /> Robotics.
      </h2>
      <p>Embrace the power of Embodied AI today.</p>
      <PrimaryButton href={sourceUrl("/unitree-go2")}>Order Your Go2 Now</PrimaryButton>
    </section>
  );
}
