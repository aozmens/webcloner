// Content for the AI Robots clone, copied from https://ai-robots.apps.mdxpreview.xyz/.
// Only the home page is cloned, so every other internal destination points back to the source origin.

export const SOURCE_ORIGIN = "https://ai-robots.apps.mdxpreview.xyz";
export const ASSET_BASE = "/sites/ai-robots";

export const asset = (path: string) => `${ASSET_BASE}${path}`;
export const sourceUrl = (path: string) => `${SOURCE_ORIGIN}${path}`;

export type NavLinkItem = { label: string; href: string; image: string };
export type NavGroup = { title: string; links: NavLinkItem[] };
export type SubNav = { key: string; groups: NavGroup[]; ownLink?: { label: string; href: string } };

export const subNavs: SubNav[] = [
  {
    key: "humanoid",
    groups: [
      {
        title: "humanoid robot",
        links: [
          { label: "h2", href: "/unitree-h2", image: "/images/menu/desktop/humanoid/h2.png" },
          { label: "r1", href: "/unitree-r1", image: "/images/menu/desktop/humanoid/r1.png" },
          { label: "g1", href: "/unitree-g1", image: "/images/menu/desktop/humanoid/g1.png" },
          { label: "h1/h2", href: "/unitree-h1-h2", image: "/images/menu/desktop/humanoid/h1_h2.png" },
        ],
      },
    ],
  },
  {
    key: "quadruped",
    groups: [
      {
        title: "Wheeled Legged Robot Dog",
        links: [
          { label: "Go2- W", href: "/unitree-go2-w", image: "/images/menu/desktop/quadruped/go2_w.png" },
          { label: "B2- W", href: "/unitree-b2-w", image: "/images/menu/desktop/quadruped/b2_w.png" },
        ],
      },
      {
        title: "Legged Robot Dog",
        links: [
          { label: "Go2", href: "/unitree-go2", image: "/images/menu/desktop/quadruped/go2.png" },
          { label: "B2", href: "/unitree-b2", image: "/images/menu/desktop/quadruped/b2.png" },
          { label: "A2", href: "/unitree-a2", image: "/images/menu/desktop/quadruped/a2.png" },
        ],
      },
      {
        title: "Manipulators",
        links: [{ label: "z1 / d1", href: "/z1-d1", image: "/images/menu/desktop/quadruped/z1_d1.png" }],
      },
      {
        title: "Perception",
        links: [{ label: "4D LIDAR L2", href: "/l2-4d-lidar", image: "/images/menu/desktop/quadruped/4d.png" }],
      },
    ],
    ownLink: { label: "About quadruped", href: "/quadruped" },
  },
  {
    key: "digital human",
    groups: [
      {
        title: "Digital Human",
        links: [
          { label: "Holographic Cabinet KIEFER", href: "/holographic-cabinet", image: "/images/menu/desktop/digital/holo.png" },
          { label: "OLED Mobile Robot KIEFER", href: "/oled-mobile-robot", image: "/images/menu/desktop/digital/holo.png" },
        ],
      },
    ],
  },
];

// The mobile menu uses its own (larger) product shots.
export const mobileMenu: NavGroup[][] = [
  [
    {
      title: "humanoid robot",
      links: [
        { label: "h2", href: "/unitree-h2", image: "/images/menu/h2.png" },
        { label: "r1", href: "/unitree-r1", image: "/images/menu/r1.png" },
        { label: "g1", href: "/unitree-g1", image: "/images/menu/g1.png" },
        { label: "h1/h2", href: "/unitree-h1-h2", image: "/images/menu/h2.png" },
      ],
    },
  ],
  [
    {
      title: "Wheeled Legged Robot Dog",
      links: [
        { label: "Go2- W", href: "/unitree-go2-w", image: "/images/menu/go2_w.png" },
        { label: "B2- W", href: "/unitree-b2-w", image: "/images/menu/b2_w.png" },
      ],
    },
    {
      title: "Legged Robot Dog",
      links: [
        { label: "Go2", href: "/unitree-go2", image: "/images/menu/go2.png" },
        { label: "B2", href: "/unitree-b2", image: "/images/menu/b2.png" },
        { label: "A2", href: "/unitree-a2", image: "/images/menu/a2.png" },
      ],
    },
    { title: "Manipulators", links: [{ label: "z1 / d1", href: "/z1-d1", image: "/images/menu/z1_d1.png" }] },
    { title: "Perception", links: [{ label: "4D LIDAR L2", href: "/l2-4d-lidar", image: "/images/menu/4d.png" }] },
  ],
  [
    {
      title: "Digital Human",
      links: [
        { label: "Holographic Cabinet KIEFER", href: "/holographic-cabinet", image: "/images/menu/digital.png" },
        { label: "OLED Mobile Robot KIEFER", href: "/oled-mobile-robot", image: "/images/menu/digital.png" },
      ],
    },
  ],
];

export const mobileMenuTitles = ["humanoid", "quadruped", "digital human"];

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

export const footerColumns: FooterColumn[] = [
  {
    title: "Quadruped Robots",
    links: [
      { label: "Go2-W", href: "/unitree-go2-w" },
      { label: "B2-W", href: "/unitree-b2-w" },
      { label: "Go2", href: "/unitree-go2" },
      { label: "B2", href: "/unitree-b2" },
      { label: "A2", href: "/unitree-a2" },
    ],
  },
  {
    title: "Humanoid Robots",
    links: [
      { label: "Unitree G1", href: "/unitree-g1" },
      { label: "Unitree R1", href: "/unitree-r1" },
      { label: "Unitree H2", href: "/unitree-h2" },
      { label: "Unitree H1/H2", href: "/unitree-h1-h2" },
    ],
  },
  {
    title: "Accessories & Add-ons",
    links: [
      { label: "4D LiDAR Systems", href: "/l2-4d-lidar" },
      { label: "Dexterous Hands (for G1)", href: "/l2-4d-lidar" },
      { label: "Batteries & Chargers", href: "/accessories/batteries" },
      { label: "Development Kits & SDKs", href: "/accessories/development" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Industrial Inspection", href: "/industries/manufacturing" },
      { label: "Education & Research", href: "/industries/education-research" },
      { label: "Construction", href: "/industries/construction" },
      { label: "Agriculture", href: "/industries/agriculture" },
      { label: "Personal & Entertainment", href: "/industries/personal-entertainment" },
    ],
  },
  {
    title: "Contact us",
    links: [
      { label: "Contact Sales", href: "/contact" },
      { label: "Request Demo", href: "/request-demo" },
      { label: "Technical Support", href: "/tech-support" },
      { label: "Location & Hours", href: "/locations" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "Our Story", href: "/story" },
      { label: "Unitree Partnership", href: "/unitree-partnership" },
    ],
  },
  { title: "Resources Overview", links: [{ label: "news", href: "/blog" }] },
  {
    title: "Legal",
    links: [
      { label: "Returns & Refunds Policy", href: "/legal/returns-refunds" },
      { label: "Terms & Conditions", href: "/legal/terms-conditions" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Cookie Policy", href: "/legal/cookie-policy" },
      { label: "Seller Liability", href: "/legal/seller-liability" },
    ],
  },
];

export const socialLinks = [
  { label: "linkedin", href: "https://www.linkedin.com/company/ai-robots-gr/", className: "bottom-link" },
  { label: "youtube", href: "https://www.youtube.com/@PhysicalAILab", className: "bottom-link desc-link" },
  { label: "instagram", href: "https://www.instagram.com/airobots.ai/", className: "bottom-link" },
];

export const heroSlides = [
  {
    eyebrow: "destiny awakening",
    title: "Unitree H2",
    text: "The world's most advanced universal humanoid robot. Featuring 31 DOF, 360N·m joint torque, and a 2070 TOPS compute platform.",
    cta: "Discover H2",
    href: "/unitree-h2",
    step: "H2",
  },
  {
    eyebrow: "Go Beyond the Limits",
    title: "Unitree B2",
    text: "The fastest industrial-grade quadruped. IP67-rated, 40kg payload, >6m/s speed, built for extreme environments and critical inspection missions.",
    cta: "Explore B2",
    href: "/unitree-b2",
    step: "B2",
  },
  {
    eyebrow: "New Creature of Embodied AI",
    title: "Unitree Go2",
    text: "The most accessible and intelligent companion robot. Equipped with 4D LiDAR, ISS 2.0 side-follow, and a powerful AI core.",
    cta: "Learn About Go2",
    href: "/unitree-go2",
    step: "Go2",
  },
  {
    eyebrow: "Go Further with Higher Efficiency",
    title: "Unitree B2-w",
    text: "The ultimate hybrid mobility platform. Combines legs and wheels for 15 km/h speed and 25km range with a heavy payload.",
    cta: "See B2-W",
    href: "/unitree-b2-w",
    step: "B2-w",
  },
];

export const autonomyDetails = [
  {
    icon: "/icons/gps.svg",
    title: "Autonomous Tracking & Patrol",
    text: "Automatically identifies inspection tasks and target components, executing missions autonomously with self-planned patrols and zero blind spots.",
  },
  {
    icon: "/icons/waves.svg",
    title: "Unmatched Terrain Adaptability",
    text: "Effortlessly navigates complex environments, including stairs, slopes, and rubble, ensuring 90% all-terrain coverage.",
  },
  {
    icon: "/icons/central.svg",
    title: "Centralized Remote Control",
    text: "Real-time data upload to a centralized control platform allows for remote monitoring, mission adjustment, and intelligent management from any location.",
  },
  {
    icon: "/icons/eye.svg",
    title: "Advanced LiDAR & AI Vision",
    text: "Utilizes high-definition LiDAR and AI-powered vision for 3D mapping, obstacle avoidance, and precise object recognition.",
  },
];

export const redefiningCards = [
  {
    icon: "/icons/ray.svg",
    title: "Dynamic Interaction",
    text: "A personality that learns and evolves with your family, powered by a sophisticated Large Behavior Model.",
  },
  {
    icon: "/icons/infinity.svg",
    title: "Ultimate Mobility",
    text: "Proprietary motors and control algorithms for seamless indoor/outdoor navigation.",
  },
  {
    icon: "/icons/side.svg",
    title: "Open Platform Fun",
    text: "An open SDK for coding, education, and unlimited customization of tricks and skills.",
  },
];
