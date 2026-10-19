export const DEFAULT_STORE_DATA = {
  settings: {
    brandName: "Chandrakanta",
    tagline: "Premium Ethnic Wear",
    metaTitle: "Chandrakanta – Premium Ethnic Sarees & Suit Sets for Women",
    metaDescription: "Explore Chandrakanta's exquisite collection of handcrafted ethnic sarees, Banarasi silks, Kanjivaram, and unstitched suit sets.",
    phonePrimary: "+91 98765 43210",
    whatsappNumber: "919876543210",
    supportEmail: "care@chandrakanta.in",
    address: "Crafted with love in Varanasi & Lucknow, Uttar Pradesh",
    freeShippingThreshold: 1999,
    standardShippingFee: 99,
    currencySymbol: "₹"
  },
  announcements: [
    "Free Shipping Above ₹1999",
    "New Festive Collection — Now Live",
    "Banarasi & Kanjivaram Sarees Handcrafted",
    "Unstitched Suit Sets from ₹799",
    "COD Available Across India",
    "Easy 7-Day Returns"
  ],
  hero: {
    label: "New Festive Collection 2024",
    title: "Tradition Woven in Every Thread",
    italicWord: "Every Thread",
    subtitle: "Discover Chandrakanta's exquisite handcrafted sarees and unstitched suit sets — where heritage meets elegance.",
    primaryCtaText: "Shop Sarees",
    primaryCtaLink: "#sarees",
    secondaryCtaText: "Explore Suit Sets",
    secondaryCtaLink: "#suits",
    bannerImage: "/images/hero.jpg",
    altText: "Elegant woman in a rich Chandrakanta silk saree amid golden bokeh lights"
  },
  trustStrip: [
    { id: 1, title: "Free Shipping above ₹1999", icon: "Truck" },
    { id: 2, title: "100% Authentic Handloom", icon: "ShieldCheck" },
    { id: 3, title: "7-Day Easy Returns", icon: "RotateCcw" },
    { id: 4, title: "Cash on Delivery Available", icon: "Banknote" },
    { id: 5, title: "24/7 Customer Support", icon: "Headphones" }
  ],
  festive: {
    label: "Festive Edit 2024",
    title: "Dress for Every Celebration",
    italicWord: "Celebration",
    description: "From Diwali to Dussehra, weddings to sangeets — Chandrakanta's festive collection brings timeless tradition to every joyful occasion. Each piece is a masterpiece.",
    ctaText: "Explore Festive Edit",
    ctaLink: "#sarees",
    images: [
      "/images/suit-navy.jpg",
      "/images/saree-purple.jpg"
    ]
  },
  whyUs: {
    label: "Our Promise",
    title: "Why Chandrakanta?",
    description: "We believe every woman deserves to feel like royalty. Here's our commitment to you.",
    items: [
      {
        id: 1,
        title: "Handcrafted Quality",
        description: "Every saree is woven by master artisans using age-old techniques passed down through generations across Varanasi and Kanchipuram."
      },
      {
        id: 2,
        title: "Authentic Weaves",
        description: "Sourced directly from Varanasi, Kanchipuram & Lucknow. 100% genuine silk, cotton, and georgette. No imitations, ever."
      },
      {
        id: 3,
        title: "Hassle-Free Returns",
        description: "Not satisfied? Return within 7 days for a full refund. No questions asked. We stand behind every piece we sell."
      },
      {
        id: 4,
        title: "Pan-India Delivery",
        description: "Fast, tracked shipping to every corner of India. Free delivery above ₹1999. Cash on Delivery available nationwide."
      }
    ]
  },
  testimonials: {
    label: "Customer Love",
    title: "What Our Customers Say",
    description: "Thousands of happy customers across India trust Chandrakanta for their most special occasions.",
    items: [
      {
        id: 1,
        rating: 5,
        quote: "The Banarasi saree I ordered for my daughter's wedding was breathtaking. The zari work was even more beautiful in person. Chandrakanta never disappoints!",
        name: "Sunita Sharma",
        location: "Lucknow, Uttar Pradesh",
        avatarLetter: "S"
      },
      {
        id: 2,
        rating: 5,
        quote: "I ordered an unstitched suit set and the fabric quality is top-notch. The embroidery is incredibly detailed and colours are exactly as shown. Will definitely order again!",
        name: "Priya Mehta",
        location: "Mumbai, Maharashtra",
        avatarLetter: "P"
      },
      {
        id: 3,
        rating: 5,
        quote: "Fast delivery, beautiful packaging and the Kanjivaram saree exceeded all my expectations. The silk feels genuinely luxurious. Highly recommend Chandrakanta!",
        name: "Ananya Krishnan",
        location: "Chennai, Tamil Nadu",
        avatarLetter: "A"
      }
    ]
  },
  newsletter: {
    label: "Stay Connected",
    title: "First to Know, First to Glow",
    description: "Subscribe for exclusive access to new arrivals, festive offers and insider styling tips — straight to your inbox.",
    buttonText: "Subscribe",
    placeholder: "Your email address"
  },
  categories: [
    {
      id: "sarees",
      name: "Sarees",
      count: "200+ Styles",
      image: "/images/cat-saree.jpg",
      link: "#sarees",
      description: "Timeless Banarasi, Kanjivaram and Chiffon drapes"
    },
    {
      id: "suits",
      name: "Suit Sets",
      count: "150+ Styles",
      image: "/images/cat-suits.jpg",
      link: "#suits",
      description: "Unstitched and Anarkali suits crafted with intricate embroidery"
    },
    {
      id: "bridal",
      name: "Bridal Lehengas",
      count: "80+ Styles",
      image: "/images/cat-bridal.jpg",
      link: "#bridal",
      description: "Royal velvet and silk couture bridal outfits"
    }
  ],
  products: [
    {
      id: "prod-1",
      name: "Teal Zari Weave Saree",
      type: "Banarasi Silk",
      category: "sarees",
      price: 3499,
      originalPrice: 5200,
      discount: "33% off",
      badge: "Bestseller",
      image: "/images/saree-teal.jpg",
      swatches: ["#1a6b6b", "#7B1C1C", "#2c3e6b"],
      stock: 18,
      isFeatured: true,
      isNew: false,
      description: "Authentic Banarasi silk saree woven with golden zari floral bootis across teal body, paired with an unstitched brocade blouse piece.",
      details: ["Fabric: Pure Silk Blend", "Weave: Banarasi Kadhwa Zari", "Length: 5.5m Saree + 0.8m Blouse", "Care: Dry Clean Only"]
    },
    {
      id: "prod-2",
      name: "Royal Purple Peacock Saree",
      type: "Kanjivaram Silk",
      category: "sarees",
      price: 6299,
      originalPrice: 8500,
      discount: "26% off",
      badge: "New",
      image: "/images/saree-purple.jpg",
      swatches: ["#5c2d91", "#a01010", "#1a6b1a"],
      stock: 12,
      isFeatured: true,
      isNew: true,
      description: "Handwoven pure Kanjivaram silk saree with contrast gold zari peacock pallu and temple korvai borders.",
      details: ["Fabric: Mulberry Silk", "Zari: Tested Gold Zari", "Length: 5.5m + 0.8m Blouse", "Origin: Kanchipuram Weavers"]
    },
    {
      id: "prod-3",
      name: "Crimson Floral Zari Saree",
      type: "Banarasi Silk",
      category: "sarees",
      price: 4199,
      originalPrice: 6000,
      discount: "30% off",
      badge: "",
      image: "/images/saree-crimson.jpg",
      swatches: ["#a01010", "#1a4a6b"],
      stock: 15,
      isFeatured: true,
      isNew: false,
      description: "Rich crimson red Banarasi silk adorned with delicate gold zari jaal pattern for weddings and festive pujas.",
      details: ["Fabric: Chiniya Silk", "Weave: Floral Jaal", "Occasion: Bridal, Festive", "Care: Dry Clean"]
    },
    {
      id: "prod-4",
      name: "Rose Anarkali Gota Suit Set",
      type: "Unstitched Suit Set",
      category: "suits",
      price: 1899,
      originalPrice: 2800,
      discount: "32% off",
      badge: "Top Rated",
      image: "/images/suit-rose.jpg",
      swatches: ["#c9828a", "#8a82c9", "#82c98a"],
      stock: 25,
      isFeatured: true,
      isNew: false,
      description: "Graceful dusty rose Anarkali unstitched suit fabric in pure chanderi with hand-applied gota patti work on yoke and dupatta.",
      details: ["Top: Chanderi Silk 2.5m", "Bottom: Shantoon 2.5m", "Dupatta: Chiffon Gota Patti 2.25m", "Type: Unstitched"]
    },
    {
      id: "prod-5",
      name: "Midnight Navy Chanderi Suit",
      type: "Unstitched Suit Set",
      category: "suits",
      price: 2199,
      originalPrice: 3200,
      discount: "31% off",
      badge: "Festive Pick",
      image: "/images/suit-navy.jpg",
      swatches: ["#192338", "#7B1C1C", "#108474"],
      stock: 20,
      isFeatured: false,
      isNew: false,
      description: "Deep midnight blue fine chanderi suit set featuring zari weaving on neckline and delicate organza dupatta.",
      details: ["Top: Chanderi 2.5m", "Bottom: Pure Cotton 2.5m", "Dupatta: Organza 2.3m"]
    },
    {
      id: "prod-6",
      name: "Emerald Royale Anarkali Suit",
      type: "Festive Suit Set",
      category: "suits",
      price: 2899,
      originalPrice: 4200,
      discount: "31% off",
      badge: "New In",
      image: "/images/suit-emerald.jpg",
      swatches: ["#0b4f3b", "#7B1C1C", "#C8922A"],
      stock: 14,
      isFeatured: true,
      isNew: true,
      description: "Regal emerald green pure silk Anarkali suit set with heavy gold zari neckline embroidery and scalloped organza dupatta.",
      details: ["Fabric: Silk Chanderi", "Work: Zari & Resham thread", "Fit: Custom Tailorable"]
    },
    {
      id: "prod-7",
      name: "Blush Flora Organza Saree",
      type: "Handcrafted Organza",
      category: "sarees",
      price: 3899,
      originalPrice: 5500,
      discount: "29% off",
      badge: "Trending",
      image: "/images/saree-organza.jpg",
      swatches: ["#f2c4ce", "#d4af37", "#a0c4ff"],
      stock: 10,
      isFeatured: true,
      isNew: true,
      description: "Ethereal blush pink organza saree with hand-painted pastel floral motifs and scalloped gold zari borders.",
      details: ["Fabric: Premium Sheer Organza", "Border: Scalloped Zari", "Blouse: Raw Silk Included"]
    },
    {
      id: "prod-8",
      name: "Imperial Velvet Bridal Lehenga",
      type: "Bridal Couture",
      category: "bridal",
      price: 18999,
      originalPrice: 28000,
      discount: "32% off",
      badge: "Couture",
      image: "/images/lehenga-bridal.jpg",
      swatches: ["#7B1C1C", "#3d1020"],
      stock: 5,
      isFeatured: true,
      isNew: false,
      description: "Heavy bridal lehenga in rich velvet with authentic hand-stitched zardozi and kundan work with bridal veil dupatta.",
      details: ["Lehenga: Micro Velvet", "Flair: 4.2 Meters", "Embroidery: Zardozi, Cutdana, Dori", "Dupatta: Soft Tulle Double Dupatta"]
    }
  ],
  theme: {
    activePreset: "crimson-gold",
    colors: {
      accent: "#7B1C1C",
      accentDk: "#5a1212",
      accentLt: "#c23939",
      gold: "#C8922A",
      goldLt: "#e8c87a",
      bg: "#faf8f5",
      surface: "#ffffff",
      surface2: "#f5f0ea",
      text: "#171717",
      textMuted: "#666666",
      border: "#e0e0e0"
    },
    typography: {
      fontDisp: "'Playfair Display', Georgia, serif",
      fontBody: "'Mulish', 'Helvetica Neue', sans-serif"
    },
    radii: {
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "999px"
    },
    shadow: "luxury"
  },
  layout: {
    gridColumns: {
      desktop: 4,
      tablet: 2,
      mobile: 2
    },
    heroVariant: "center",
    headerVariant: "sticky",
    categoryStyle: "cards",
    visibleSections: {
      announcementBar: true,
      hero: true,
      trustStrip: true,
      categories: true,
      featuredProducts: true,
      festiveBanner: true,
      whyUs: true,
      testimonials: true,
      newsletter: true,
      footer: true,
      floatingMobileBar: true
    },
    sectionOrder: [
      "hero",
      "trustStrip",
      "categories",
      "featuredProducts",
      "festiveBanner",
      "whyUs",
      "testimonials",
      "newsletter"
    ]
  }
};
