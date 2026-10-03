const products = [
      { 
        id: 1,  
        name: "1 Million", 
        ref: "Gold Digger", 
        category: "hombre",
        img: "img/img-002.png", 
        desc: "Una fragancia audaz con notas amaderadas y toques de cuero y especias, perfecta para destacar en la noche.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 2,  
        name: "Tom Ford F'n Fabulous", 
        ref: "F'n Marvelous", 
        category: "unisex",
        img: "img/img-003.png", 
        desc: "Un aroma cuero-oriental sofisticado y exclusivo, enriquecido con almendra amarga y haba tonka.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 3,  
        name: "Sauvage Elixir", 
        ref: "Savage Spell", 
        category: "hombre",
        img: "img/img-004.png", 
        desc: "Concentración extraordinaria de notas especiadas, lavanda fresca y un fondo de maderas ricas.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 4,  
        name: "Christian Clive Blonde Amber", 
        ref: "Goldie Luxe", 
        category: "unisex",
        img: "img/goldie_luxe.jpg", 
        desc: "Ámbar cálido, notas frutales y un toque de ron que evocan elegancia atemporal.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 5,  
        name: "Creed Queen of Silk", 
        ref: "Sew Over You", 
        category: "mujer",
        img: "img/sew_over_you.jpg", 
        desc: "Una esencia envolvente con flores blancas, vainilla suave y notas amaderadas delicadas.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 6,  
        name: "YSL Libre", 
        ref: "Libre-Ate Me", 
        category: "mujer",
        img: "img/img-005.png", 
        desc: "El equilibrio perfecto entre la lavanda francesa y la flor de azahar marroquí.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 7,  
        name: "JPG Le Male Elixir", 
        ref: "Alpha Elixir", 
        category: "hombre",
        img: "img/alpha_elixir.jpg", 
        desc: "Intenso y sensual con notas dulces de haba tonka, menta fresca y benjuí.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 8,  
        name: "Tom Ford Electric Cherry", 
        ref: "Cherry Spark", 
        category: "unisex",
        img: "img/img-006.png", 
        desc: "Cereza ácida combinada con jazmín dulce y pimienta rosada vibrante.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 9,  
        name: "Bleu de Chanel", 
        ref: "Azure Depth", 
        category: "hombre",
        img: "img/img-007.png", 
        desc: "Una fragancia aromática y amaderada de carácter independiente y elegante.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 10, 
        name: "Azzaro Most Wanted", 
        ref: "Wanted Dead or Adored", 
        category: "hombre",
        img: "img/img-010.png", 
        desc: "Un aroma amaderado oriental de alta intensidad con cardamomo, toffee y madera de ámbar.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 11, 
        name: "YSL Y", 
        ref: "Why Not", 
        category: "hombre",
        img: "img/img-011.png", 
        desc: "Aroma fresco y profundo con notas de bergamota, salvia y madera de cedro.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 12, 
        name: "JPG Ultra Male", 
        ref: "Alpha Noir", 
        category: "hombre",
        img: "img/img-012.png", 
        desc: "Una explosión de pera dulce, lavanda negra y vainilla amaderada.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 13, 
        name: "Viktor Rolf Spicebomb Extreme", 
        ref: "Spice to Meet You", 
        category: "hombre",
        img: "img/img-013.png", 
        desc: "Combinación explosiva de especias cálidas, comino, canela y tabaco rico.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 14, 
        name: "Tom Ford Ombré Leather", 
        ref: "Leather Late Than Never", 
        category: "unisex",
        img: "img/img-014.png", 
        desc: "Cuero texturizado, cardamomo y jazmín que proyectan libertad y profundidad.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 15, 
        name: "Born in Roma Intense", 
        ref: "When in Roma", 
        category: "hombre",
        img: "img/img-015.png", 
        desc: "Un homenaje moderno con notas de vainilla magnética y jazmín solar.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 17, 
        name: "Ex Nihilo Blue Talisman", 
        ref: "Ya Blue Me Away", 
        category: "unisex",
        img: "img/img-017.png", 
        desc: "Pera, bergamota, flor de azahar y maderas que crean un amuleto olfativo único.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 18, 
        name: "Acqua di Giò Profumo", 
        ref: "Holy Ship You Clean Up Nice", 
        category: "hombre",
        img: "img/holy_ship.jpg", 
        desc: "Frescura marina combinada con la profundidad del incienso y el pachulí.",
        variants: [
          { size: "20 ml", priceUSD: 20 },
          { size: "50 ml", priceUSD: 35 }
        ]
      },
      { 
        id: 19, 
        name: "Miss Dior", 
        ref: "Cherry On Top", 
        category: "mujer",
        img: "img/cherry_on_top.jpg", 
        desc: "Un bouquet floral elegante con notas de rosa de Grasse, peonía y un toque fresco y romántico.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 20, 
        name: "Tom Ford Tobacco Vanille", 
        ref: "Cigars & Ice Cream", 
        category: "unisex",
        img: "img/cigars_ice_cream.jpg", 
        desc: "Una opulenta mezcla de hoja de tabaco, especias aromáticas, vainilla dulce y cacao suave.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 21, 
        name: "YSL MYSLF", 
        ref: "Eternal Bergamot", 
        category: "hombre",
        img: "img/eternal_bergamot.jpg", 
        desc: "Una fragancia floral-amaderada moderna centrada en la bergamota fresca y la flor de azahar.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 22, 
        name: "Paco Rabanne Invictus", 
        ref: "Exor", 
        category: "hombre",
        img: "img/exor.jpg", 
        desc: "Aroma fresco y vibrante con acorde marino, pomelo radiante y un fondo de madera de gualaco.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 23, 
        name: "Louis Vuitton Ombre Nomade", 
        ref: "Incense Oud", 
        category: "unisex",
        img: "img/incense_oud.jpg", 
        desc: "Un viaje sensorial intenso cargado de madera de Oud, lágrimas de incienso y toques de frambuesa.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 24, 
        name: "Versace Eros", 
        ref: "Mint Ocean", 
        category: "hombre",
        img: "img/mint_ocean.jpg", 
        desc: "Una explosión de frescura con menta, manzana verde y limón italiano respaldados por haba tonka.",
        variants: [
          { size: "30 ml", priceUSD: 20 }
        ]
      },
      { 
        id: 25,
        name: "Sauvage Elixir",
        ref: "Desert Elixir",
        category: "hombre",
        img: "img/desert_elixir.webp",
        desc: "Una interpretación intensa y especiada, con lavanda, cítricos y un fondo amaderado.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      },
      { 
        id: 26,
        name: "Bleu de Chanel",
        ref: "Blue Eclipse",
        category: "hombre",
        img: "img/blue_eclipse.webp",
        desc: "Un perfil aromático y amaderado, fresco y elegante, pensado para el uso diario.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      },
      { 
        id: 27,
        name: "Carolina Herrera Good Girl",
        ref: "Midnight Heel",
        category: "mujer",
        img: "img/midnight_heel.webp",
        desc: "Una mezcla envolvente de flores blancas, almendra y un fondo cálido y sofisticado.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      },
      { 
        id: 28,
        name: "Azzaro The Most Wanted",
        ref: "Final Hour",
        category: "hombre",
        img: "img/final_hour.webp",
        desc: "Dulce, cálida y especiada, con cardamomo, caramelo y maderas de ámbar.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      },
      { 
        id: 29,
        name: "YSL Y",
        ref: "Why Y",
        category: "hombre",
        img: "img/why_y.webp",
        desc: "Fresca y aromática, con manzana, salvia y maderas en un perfil limpio y moderno.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      },
      { 
        id: 30,
        name: "Rabanne 1 Million",
        ref: "Crown Fortune",
        category: "hombre",
        img: "img/crown_fortune.webp",
        desc: "Un acorde cálido y especiado con cítricos, canela y una base dulce y amaderada.",
        variants: [{ size: "30 ml", priceUSD: 25 }]
      }
];

const meta={
1:['Oriental','duppe',['Dulce','Amaderada']],2:['Cuero','duppe',['Cuero','Oriental']],3:['Oriental','duppe',['Especiada','Amaderada']],4:['Ámbar','duppe',['Ámbar','Frutal']],5:['Floral','duppe',['Floral','Amaderada']],6:['Floral','duppe',['Floral','Fresca']],7:['Gourmand','duppe',['Dulce','Fresca']],8:['Frutal','duppe',['Frutal','Floral']],9:['Amaderada','duppe',['Fresca','Amaderada']],10:['Gourmand','duppe',['Dulce','Especiada']],11:['Fresca','duppe',['Fresca','Amaderada']],12:['Gourmand','duppe',['Dulce','Frutal']],13:['Oriental','duppe',['Especiada','Amaderada']],14:['Cuero','duppe',['Cuero','Amaderada']],15:['Gourmand','duppe',['Dulce','Floral']],17:['Fresca','duppe',['Frutal','Fresca']],18:['Fresca','duppe',['Marina','Amaderada']],19:['Floral','eternals',['Floral','Frutal']],20:['Gourmand','eternals',['Dulce','Especiada']],21:['Floral','eternals',['Floral','Fresca']],22:['Fresca','eternals',['Fresca','Frutal']],23:['Oriental','eternals',['Oud','Amaderada']],24:['Fresca','eternals',['Fresca','Gourmand']],25:['Oriental','compoundone',['Especiada','Amaderada']],26:['Amaderada','compoundone',['Fresca','Amaderada']],27:['Floral','compoundone',['Floral','Oriental']],28:['Gourmand','compoundone',['Dulce','Especiada']],29:['Fresca','compoundone',['Fresca','Amaderada']],30:['Gourmand','compoundone',['Dulce','Especiada']]
};

products.forEach(p=>{const m=meta[p.id]||['Amaderada','duppe',[]];p.family=m[0];p.collection=m[1];p.tags=m[2]||[]});

export { products };
