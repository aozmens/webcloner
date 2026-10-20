"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Splide from "@splidejs/splide";

// Behaviour ported from the source's ScriptsLayout + home bundles: ScrollSmoother on landscape screens,
// preloader/intro timeline, desktop sub-nav, footer accordion, hero carousel and scroll-linked sections.

const conditions = {
  isPortraitRes: "(orientation: portrait)",
  isDesktopRes: "(orientation: landscape)",
  isPortraitResPhone: "(orientation: portrait) and (max-aspect-ratio: 0.625)",
};

type Conditions = Record<keyof typeof conditions, boolean>;

const readConditions = (context: gsap.Context) => context.conditions as Conditions;

function preloaderOutro() {
  return gsap
    .timeline({ paused: true, defaults: { duration: 0.25 } })
    .to("#preloader > .logo > .brand-logo", { yPercent: -100, ease: "power1.inOut", immediateRender: false, delay: 1 })
    .fromTo("#preloader", { autoAlpha: 1 }, { autoAlpha: 0, immediateRender: false, duration: 1 }, "<50%");
}

function preloaderIntro() {
  return gsap
    .timeline({ paused: true, defaults: { duration: 0.25 } })
    .fromTo("#preloader > .logo > .brand-logo", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power1.out" });
}

/** Arrow/Page/Home/End/Space keys drive the smoother the way the source's keyboard handler does. */
function bindSmootherKeys(smoother: ScrollSmoother) {
  const held = new Set<string>();
  const maxSpeed = 800;
  const easing = 0.08;
  const minVelocity = 0.5;
  let velocity = 0;
  let ticking = false;

  const maxScroll = () => Math.max(0, (smoother.content()?.offsetHeight ?? 0) - window.innerHeight);

  const tick = (_time: number, deltaTime: number) => {
    let direction = 0;
    if (held.has("ArrowDown")) direction += 1;
    if (held.has("ArrowUp")) direction -= 1;
    velocity += (direction * maxSpeed - velocity) * easing;
    const current = smoother.scrollTop();
    const next = Math.max(0, Math.min(maxScroll(), current + velocity * (deltaTime / 1000)));
    if (next !== current) smoother.scrollTop(next);
    if (held.size === 0 && Math.abs(velocity) < minVelocity) {
      velocity = 0;
      gsap.ticker.remove(tick);
      ticking = false;
    }
  };

  const startTicking = () => {
    if (ticking) return;
    ticking = true;
    gsap.ticker.add(tick);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const active = document.activeElement as HTMLElement | null;
    const tag = active?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || active?.isContentEditable) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!event.repeat) {
        held.add(event.key);
        startTicking();
      }
      return;
    }
    if (event.repeat) return;
    const page = window.innerHeight * 0.9;
    const current = smoother.scrollTop();
    let target: number;
    switch (event.key) {
      case "PageDown":
        target = current + page;
        break;
      case "PageUp":
        target = current - page;
        break;
      case "Home":
        target = 0;
        break;
      case "End":
        target = maxScroll();
        break;
      case " ":
        if (tag === "BUTTON" || tag === "A") return;
        target = current + (event.shiftKey ? -page : page);
        break;
      default:
        return;
    }
    event.preventDefault();
    smoother.scrollTo(Math.max(0, Math.min(maxScroll(), target)), true);
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") held.delete(event.key);
  };
  const onBlur = () => held.clear();

  window.addEventListener("keydown", onKeyDown, { capture: true });
  window.addEventListener("keyup", onKeyUp, { capture: true });
  window.addEventListener("blur", onBlur);

  return () => {
    window.removeEventListener("keydown", onKeyDown, { capture: true });
    window.removeEventListener("keyup", onKeyUp, { capture: true });
    window.removeEventListener("blur", onBlur);
    if (ticking) gsap.ticker.remove(tick);
    held.clear();
  };
}

function setupSubNav() {
  const links = gsap.utils.toArray<HTMLElement>(".nav-link");
  const subNavs = gsap.utils.toArray<HTMLElement>(".sub-nav");
  const cleanups: (() => void)[] = [];

  const timelines = subNavs.map((subNav) => {
    const anchors = Array.from(subNav.querySelectorAll<HTMLAnchorElement>("a"));
    const timeline = gsap
      .timeline({ paused: true })
      .fromTo(subNav, { autoAlpha: 0, y: "2vw" }, { autoAlpha: 1, y: "0.5vw", duration: 0.25 })
      .from(anchors, { opacity: 0, stagger: 0.05, duration: 0.2, ease: "power1.in" }, "<25%");

    const onLeave = () => timeline.timeScale(3).tweenTo(0);
    subNav.addEventListener("mouseleave", onLeave);
    cleanups.push(() => subNav.removeEventListener("mouseleave", onLeave));

    anchors.forEach((anchor) => {
      const onClick = (event: MouseEvent) => {
        event.preventDefault();
        let navigated = false;
        const navigate = () => {
          if (navigated) return;
          navigated = true;
          window.location.assign(anchor.href);
        };
        timeline.eventCallback("onReverseComplete", navigate);
        timeline.timeScale(3).tweenTo(0, { onComplete: navigate });
      };
      anchor.addEventListener("click", onClick);
      cleanups.push(() => anchor.removeEventListener("click", onClick));
    });
    return timeline;
  });

  const show = (linkIndex: number) => {
    timelines.forEach((timeline, index) => {
      if (index + 1 === linkIndex) timeline.timeScale(1).tweenTo(timeline.totalDuration());
      else timeline.timeScale(3).tweenTo(0);
    });
  };

  links.forEach((link, index) => {
    const onEnter = () => show(index);
    link.addEventListener("mouseenter", onEnter);
    cleanups.push(() => link.removeEventListener("mouseenter", onEnter));
  });

  const onWindowClick = ({ target }: MouseEvent) => {
    const element = target as HTMLElement;
    if (element.classList.contains("nav-link") || element.classList.contains("sub-nav")) return;
    timelines.forEach((timeline) => timeline.tweenTo(0));
  };
  window.addEventListener("click", onWindowClick);
  cleanups.push(() => window.removeEventListener("click", onWindowClick));

  return () => cleanups.forEach((cleanup) => cleanup());
}

function setupFooter(context: gsap.Context) {
  const { isPortraitResPhone } = readConditions(context);
  if (isPortraitResPhone) {
    const groups = gsap.utils.toArray<HTMLElement & { openHeight?: number }>("footer .links");
    let closedHeight = 0;
    const timelines: gsap.core.Timeline[] = [];
    const cleanups: (() => void)[] = [];
    groups.forEach((group, index) => {
      const anchors = group.querySelectorAll("a");
      const button = group.querySelector("button");
      const chevron = group.querySelector("button img");
      if (index === 0) closedHeight = group.offsetHeight;
      gsap.set(anchors, { display: "block" });
      group.openHeight = group.offsetHeight;
      const timeline = gsap.timeline({ paused: true }).fromTo(group, { height: closedHeight }, { height: group.openHeight }).to(chevron, { rotate: 180 }, "<");
      timeline.reversed(true);
      timelines.push(timeline);
      const onClick = () => {
        timelines.forEach((other, otherIndex) => {
          if (index === otherIndex && other.reversed()) other.play();
          else other.reverse();
        });
      };
      button?.addEventListener("click", onClick);
      cleanups.push(() => button?.removeEventListener("click", onClick));
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }
  if (document.querySelector("footer")) {
    gsap
      .timeline({ scrollTrigger: { trigger: "footer > .brand", start: "top bottom", end: "top bottom-=5%", scrub: true, id: "footer" } })
      .to("header > .brand-link", { autoAlpha: 0 });
  }
}

function setupHeroFade() {
  gsap
    .timeline({ scrollTrigger: { trigger: "section", start: "top top", end: "bottom top-=25%", scrub: true, id: "scroll-hero" } })
    .to("#hero-section", { opacity: 0 });
}

function setupHome(context: gsap.Context) {
  const { isPortraitRes, isDesktopRes } = readConditions(context);
  let heroSplide: Splide | undefined;
  let redefiningSplide: Splide | undefined;
  let targetSplide: Splide | undefined;
  const cleanups: (() => void)[] = [];

  const intro = () => {
    const reveal = gsap
      .timeline()
      .fromTo(["header", "nav"], { y: "2vw" }, { y: "0vw", duration: 1 }, isPortraitRes ? 0.5 : 1)
      .fromTo(["header", "nav"], { autoAlpha: 0 }, { autoAlpha: 1 }, "<50%")
      .from([".hero-content > .content:first-of-type > *", ".scroll-down"], { y: "2vw", opacity: 0, stagger: 0.1 }, "<")
      .from("#hero-section .carousel-indicator", { opacity: 0, duration: 0.25 }, "-=0.25")
      .from("#hero-section .splide .splide__arrows", { autoAlpha: 0, duration: 0.25 }, "<");
    const outro = preloaderOutro();
    outro.add(reveal, 0);
    outro.progress(0).timeScale(1).tweenTo(outro.totalDuration());
  };

  const hero = () => {
    heroSplide = new Splide("#hero-splide", {
      type: "fade",
      rewind: true,
      autoplay: true,
      interval: 3500,
      speed: 2000,
      pauseOnHover: false,
      pauseOnFocus: false,
      arrows: true,
      pagination: false,
      waitForTransition: true,
      drag: false,
    });
    heroSplide.on("mounted", intro);
    heroSplide.mount();

    const splide = heroSplide;
    const line = document.querySelector(".carousel-line span");
    const stepButtons = gsap.utils.toArray<HTMLButtonElement>(".carousel-steps button");
    const share = 100 / splide.length;
    const slides = splide.Components.Slides.get();
    const contents = gsap.utils.toArray<HTMLElement>("#hero-section .content");

    const updateSlides = (index: number) => {
      const prev = splide.Components.Controller.getPrev();
      const next = splide.Components.Controller.getNext();
      slides.forEach(({ slide }, slideIndex) => {
        if (slideIndex === index) slide.classList.remove("close-left", "close-right");
        if (slide.classList.contains("close-left") && slide.classList.contains("close-right")) return;
        if (slideIndex === next) {
          slide.classList.add("close-right");
          slide.classList.remove("close-left");
        }
        if (slideIndex === prev) {
          slide.classList.add("close-left");
          slide.classList.remove("close-right");
        }
      });
      contents.forEach((content, contentIndex) => content.classList.toggle("active", contentIndex === index));
    };

    splide.on("move", (index: number) => {
      gsap.set(line, { xPercent: index * share + 15 });
      if (isDesktopRes) stepButtons.forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex <= index));
      updateSlides(index);
    });
    stepButtons.forEach((button, index) => {
      const onClick = () => splide.go(index);
      button.addEventListener("click", onClick);
      cleanups.push(() => button.removeEventListener("click", onClick));
    });
    gsap.set(line, { xPercent: 15 });
  };

  const autonomy = () => {
    if (isPortraitRes) return;
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#autonomy-section > .h2-wrapper",
          start: "top bottom-=10%",
          end: "top top",
          endTrigger: "#autonomy-section",
          scrub: isDesktopRes,
          toggleActions: "restart none none reset",
        },
      })
      .from("#autonomy-section .h2-wrapper h2", { yPercent: 105, duration: 1.5 })
      .from(".autonomy-details > .detail", { yPercent: 100, stagger: 0.25 }, "<25%")
      .from(".autonomy-details > .detail", { opacity: 0, ease: "power1.in", duration: 0.4, stagger: 0.2 }, "<")
      .from(".autonomy-robot", { yPercent: -20, rotateZ: 5, scale: 0.75, duration: 1.5 }, 0);
  };

  const redefining = () => {
    if (isDesktopRes) {
      gsap
        .timeline({ scrollTrigger: { trigger: "#redefining-section > .head", start: "top bottom", end: "top top", scrub: true } })
        .from("#redefining-section > .head > .h2-wrapper > h2", { yPercent: 110 })
        .from("#redefining-section > .head > p", { opacity: 0, ease: "power1.in" }, "<15%")
        .from("#redefining-section > .info", { y: "10vw" }, "<15%")
        .from("#redefining-section > .info > .splide > .splide__track > .splide__list > .splide__slide", { y: "10vw", stagger: 0.1, duration: 0.25 }, "<10%");
      return;
    }
    redefiningSplide = new Splide("#redefining-section > .info > .splide", {
      autoHeight: true,
      autoWidth: true,
      arrows: false,
      pagination: false,
      gap: "3vw",
      padding: "3vw",
      autoplay: true,
      interval: 2000,
      speed: 2000,
      rewind: true,
      pauseOnHover: false,
      pauseOnFocus: false,
    }).mount();
    const loaded = document.querySelector("#redefining-progress-bar > .loaded");
    redefiningSplide.on("move", (index: number) => gsap.set(loaded, { scaleX: ((index + 1) * 1) / 3 }));
    gsap.set(loaded, { scaleX: 1 / 3 });
  };

  // Teknosem has no section videos, so all three showcase items are pictures.
  const target = () => {
    if (isDesktopRes) {
      gsap
        .timeline({ scrollTrigger: { trigger: "#target-section > .head > .h2-wrapper", start: "top bottom", end: "top top+=25%", scrub: true } })
        .from("#target-section > .head > .h2-wrapper > h2", { yPercent: 110 })
        .from("#target-section > .head > span", { opacity: 0, ease: "power1.in" }, "<20%")
        .from("#target-section > .head > .progress", { opacity: 0, ease: "power1.in" }, "<20%");

      const item = (n: number) => `#target-section .list .item:nth-of-type(${n})`;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#target-section",
            start: "top top",
            end: "top top+=20%",
            endTrigger: "#target-section .splide .splide__track .list  .item:last-of-type",
            scrub: true,
            pin: "#target-section > .head",
            pinSpacing: true,
            anticipatePin: 1,
          },
        })
        .to(`${item(1)} > picture`, { scale: 0.85, opacity: 0, ease: "power1.in" })
        .to("#target-section .head .progress .steps-container .steps", { yPercent: -100 / 2.6, ease: "linear" }, "<")
        .fromTo("#target-progress-bar .loaded", { scaleY: 0.15 }, { scaleY: 2 / 3, ease: "linear" }, "<")
        .from(`${item(2)} > picture`, { scale: 0.5, filter: "blur(2vw)", ease: "power1.out" }, "<")
        .from([`${item(2)} p`, `${item(2)} span`], { y: "5vw", x: "5vw", ease: "power1.inOut" }, "<")
        .from([`${item(2)} p`, `${item(2)} span`], { opacity: 0, ease: "power1.in" }, "<")
        .to(`${item(2)} > picture`, { scale: 0.85, opacity: 0, ease: "power1.in" })
        .to("#target-section .head .progress .steps-container .steps", { yPercent: -200 / 2.6, ease: "linear" }, "<")
        .to("#target-progress-bar .loaded", { scaleY: 1, ease: "linear" }, "<")
        .from(`${item(3)} > picture`, { scale: 0.5, filter: "blur(2vw)", ease: "power1.out" }, "<")
        .from([`${item(3)} p`, `${item(3)} span`], { y: "5vw", x: "5vw", ease: "power1.inOut" }, "<")
        .from([`${item(3)} p`, `${item(3)} span`], { opacity: 0, ease: "power1.in" }, "<");
      return;
    }

    targetSplide = new Splide("#target-section .splide", {
      autoHeight: true,
      autoWidth: true,
      arrows: false,
      pagination: false,
      autoplay: true,
      interval: 2500,
      speed: 500,
      rewind: true,
      pauseOnHover: false,
      pauseOnFocus: false,
      breakpoints: { 1024: { padding: "6.5vw" }, 680: { padding: "4.5vw" } },
    }).mount();
    const splide = targetSplide;
    const loaded = document.querySelector("#target-progress-bar-mob > .loaded");
    splide.on("move", (index: number) => gsap.set(loaded, { scaleX: ((index + 1) * 1) / splide.length }));
    gsap.set(loaded, { scaleX: 1 / splide.length });
  };

  hero();
  autonomy();
  redefining();
  target();

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    heroSplide?.destroy();
    targetSplide?.destroy();
    redefiningSplide?.destroy();
  };
}

/** "Uzmanlarımıza Danışın" closing section, shared by the home and product pages. */
function setupExpert(context: gsap.Context) {
  const { isPortraitRes, isDesktopRes } = readConditions(context);
  if (!document.querySelector("#future-section")) return;
  const timeline = gsap
    .timeline({
      scrollTrigger: { trigger: "#future-section", start: "top bottom", end: "top top+=10%", scrub: isDesktopRes, toggleActions: "restart none none reset" },
    })
    .from("#future-section picture .bck", { yPercent: -45, duration: 1 })
    .fromTo("#future-section picture .bck", { scale: 2 }, { scale: 1.05, duration: 1 }, "<")
    .from("#future-section picture .bck", { opacity: 0, ease: "power1.in", duration: 0.25 }, "<")
    .from(["#future-section h2", "#future-section p", "#future-section .primary-btn"], { opacity: 0, ease: "power1.in", stagger: 0.2 }, 0.25);
  if (isPortraitRes) timeline.totalDuration(2.5);
  if (isDesktopRes) timeline.from(["#future-section h2", "#future-section p", "#future-section button"], { y: "7.5vw", stagger: 0.1 }, 0.25);
}

/** Product pages: header/nav and summary rise in like the home intro; content blocks reveal on scroll. */
function setupProduct(context: gsap.Context) {
  const { isPortraitRes } = readConditions(context);
  gsap
    .timeline({ delay: 0.15 })
    .fromTo(["header", "nav"], { y: "2vw", autoAlpha: 0 }, { y: "0vw", autoAlpha: 1, duration: 0.8 })
    .from(".product-hero .product-gallery", { y: "2vw", opacity: 0, duration: 0.8 }, "<25%")
    .from(".product-hero .product-summary > *", { y: "2vw", opacity: 0, stagger: 0.08, duration: 0.6 }, "<15%");
  // Plays once on entry: a scrubbed reveal would leave the last blocks half transparent on short pages.
  gsap.utils.toArray<HTMLElement>(".product-reveal").forEach((block) => {
    gsap.from(block, {
      y: isPortraitRes ? "6vw" : "4vw",
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: block, start: "top bottom-=10%", toggleActions: "play none none none" },
    });
  });
}

export type PageKind = "home" | "product";

export function PageScripts({ page }: { page: PageKind }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    gsap.config({ nullTargetWarn: false });

    const logo = document.querySelector("#preloader > .logo");
    logo?.classList.remove("intro");
    const logoIn = preloaderIntro();
    if (page === "home") logoIn.tweenTo(logoIn.totalDuration());

    const mm = gsap.matchMedia();
    mm.add(conditions, (context) => {
      const { isDesktopRes } = readConditions(context);
      if (!isDesktopRes) return () => ScrollTrigger.killAll();
      const smoother = ScrollSmoother.create({ smooth: 1.5, speed: 0.5, smoothTouch: 0 });
      ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
      const unbindKeys = bindSmootherKeys(smoother);
      return () => {
        unbindKeys();
        ScrollTrigger.normalizeScroll(false);
        ScrollTrigger.killAll();
        smoother.kill();
      };
    });

    // On the home page the home link points at the current page, so the source swallows the click.
    const homeLinks = page === "home" ? gsap.utils.toArray<HTMLAnchorElement>(".home-link") : [];
    const preventHome = (event: Event) => event.preventDefault();
    homeLinks.forEach((link) => link.addEventListener("click", preventHome));

    let cleanupSubNav: () => void = () => undefined;
    const subNavContext = gsap.context(() => {
      cleanupSubNav = setupSubNav();
    });

    mm.add(conditions, (context) => setupFooter(context));
    if (page === "home") {
      mm.add(conditions, () => setupHeroFade());
      mm.add(conditions, (context) => setupHome(context));
    } else {
      mm.add(conditions, (context) => setupProduct(context));
    }
    mm.add(conditions, (context) => setupExpert(context));

    return () => {
      homeLinks.forEach((link) => link.removeEventListener("click", preventHome));
      cleanupSubNav();
      subNavContext.revert();
      logoIn.kill();
      mm.revert();
    };
  }, [page]);

  return null;
}
