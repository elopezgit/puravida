/* =========================================================================
   Configuracion del negocio — datos reales de Hongos Pura Vida
   ========================================================================= */

export const BRAND = {
  name: 'Hongos Pura Vida',
  short: 'Pura Vida',
  handle: '@hongospuravida',
  claim: 'Medicina ancestral, accesible y llena de vida',
  origin: 'Tucumán, Argentina',
  format: 'Elixires de 50 ml',
} as const

export type Contact = { region: string; phone: string; href: string }

/** Los tres números que el negocio ya usa en su linktree. */
export const CONTACTS: Contact[] = [
  { region: 'Tucumán', phone: '+54 9 381 648-3779', href: 'https://wa.me/543816483779' },
  { region: 'Salta', phone: '+54 9 387 583-7677', href: 'https://wa.me/5493875837677' },
  { region: 'Córdoba', phone: '+54 9 351 386-0461', href: 'https://wa.me/543513860461' },
]

export const PRIMARY_CONTACT = CONTACTS[0]

export function waLink(message: string, contact: Contact = PRIMARY_CONTACT) {
  return `${contact.href}?text=${encodeURIComponent(message)}`
}

export const SOCIALS = [
  { label: 'Instagram', handle: '@hongospuravida', href: 'https://instagram.com/hongospuravida' },
  { label: 'Linktree', handle: 'linktr.ee/hongospuravida2', href: 'https://linktr.ee/hongospuravida2' },
  { label: 'WhatsApp', handle: PRIMARY_CONTACT.phone, href: PRIMARY_CONTACT.href },
] as const

/* --------------------------------------------------------------------- */
/*  El metodo: las tres ideas que el negocio repite en cada pieza         */
/* --------------------------------------------------------------------- */
export const PILLARS = [
  {
    n: '01',
    kicker: 'Extracción cíclica',
    title: 'El proceso que casi nadie te cuenta',
    body: 'Trabajamos el hongo en ciclos, no en una sola pasada. El resultado es una fórmula concentrada, efectiva y fácilmente absorbible por el cuerpo.',
  },
  {
    n: '02',
    kicker: 'Cavitación acústica',
    title: 'Tecnología que respeta el origen',
    body: 'Amplificamos los compuestos activos del hongo con cavitación acústica: más concentración, más absorción y la misma medicina ancestral de siempre.',
  },
  {
    n: '03',
    kicker: 'De tu casa al frasco',
    title: 'Trazabilidad de punta a punta',
    body: 'La extracción cíclica se hace en nuestra casa. Sabemos de qué lote vino cada frasco y qué se le hizo en cada ciclo.',
  },
] as const

/* --------------------------------------------------------------------- */
/*  Cifras                                                                */
/* --------------------------------------------------------------------- */
export const STATS = [
  { value: 15, suffix: '', label: 'referencias en catálogo' },
  { value: 50, suffix: ' ml', label: 'por frasco' },
  { value: 3, suffix: '×', label: 'extracción por ciclo' },
  { value: 24, suffix: '', label: 'provincias con envío' },
] as const

/* --------------------------------------------------------------------- */
/*  Testimonios — texto real de clientes                                  */
/* --------------------------------------------------------------------- */
export type Testimonial = {
  name: string
  product: string
  quote: string
  photo?: string
  stars: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sofi',
    product: 'Cordyceps',
    quote: 'Llegaba destruída a la tarde y ahora llego con más energía.',
    stars: 5,
  },
  {
    name: 'Marcos',
    product: 'Melena de León',
    quote: 'Siento la mente más calma, puedo concentrarme sin tanto ruido.',
    stars: 5,
  },
  {
    name: 'Bautista',
    product: 'Cordyceps',
    quote:
      'Me ayudaron en mi rendimiento deportista. Desde que tomo cordyceps me siento con más energía.',
    stars: 5,
  },
  {
    name: 'Abraham',
    product: 'Reishi',
    quote: 'Me cambiaron el presente. Me acompañan desde hace meses y no los cambio por nada.',
    stars: 5,
  },
  {
    name: 'María',
    product: 'Ashwagandha',
    quote: 'Bajé dos kilos. Ahora duermo mejor y me levanto menos tensa.',
    stars: 5,
  },
  {
    name: 'Norma',
    product: 'Cola de Pavo',
    quote:
      'Soy paciente oncológica y me ayudaron a transitar mi enfermedad con más calma y equilibrio.',
    stars: 5,
    photo: '/media/testimonial-norma.webp',
  },
]

/* --------------------------------------------------------------------- */
/*  El ritual diario                                                       */
/* --------------------------------------------------------------------- */
export const RITUAL = [
  {
    when: 'Mañana',
    hh: '07:30',
    title: 'Arrancar sin ruido',
    body: '30 gotas en un vaso de agua tibia con medio limón. El adaptógeno entra antes de que la cabeza empiece a girar.',
    pick: 'energia-y-enfoque',
  },
  {
    when: 'Tarde',
    hh: '16:30',
    title: 'La hora en que se cae todo',
    body: 'Un mate o un té, 30 gotas. Para los que a esta hora ya sienten que el día se les escapa de las manos.',
    pick: 'energia-y-rendimiento',
  },
  {
    when: 'Noche',
    hh: '22:00',
    title: 'Bajar el cuerpo',
    body: 'Un poco de agua tibia. La idea es desconectar: menos pantalla, más aire, y el resto lo hace el hongo.',
    pick: 'descanso-profundo',
  },
] as const

/* --------------------------------------------------------------------- */
/*  Preguntas frecuentes                                                   */
/* --------------------------------------------------------------------- */
export const FAQ = [
  {
    q: '¿Qué son los adaptógenos?',
    a: 'Son sustancias vegetales —en nuestro caso, hongos— que ayudan al organismo a adaptarse al estrés, a la fatiga y a los cambios de ritmo, sin agregar estimulantes. No aceleran el cuerpo: lo acompañan. Por eso preferimos hablar de equilibrio y no de rendimiento.',
  },
  {
    q: '¿Me van a dar más energía como el café?',
    a: 'No, y esa es la diferencia. La cafeína te presta energía y después te la cobra. Los adaptógenos sostienen una energía más baja y más estable: sin picos, sin bajones y sin esa sensación de estar al borde. Si lo que buscás es despertar de golpe, no es esto.',
  },
  {
    q: '¿Cómo se toman?',
    a: 'Son elixires de 50 ml. La forma habitual es diluir entre 20 y 30 gotas en un vaso de agua, jugo o mate, una o dos veces al día. Lo ideal es sostenerlo cuatro a seis semanas para sentir el antes y el después. Siempre se agita antes de usar y se conserva en un lugar fresco.',
  },
  {
    q: '¿Puedo tomarlos si estoy medicado o en tratamiento?',
    a: 'Si estás bajo tratamiento médico —sobre todo en casos autoinmunes, hormonales, oncológicos o con medicación anticoagulante— consultalo con tu médico antes de empezar. Nuestro equipo te orienta con calidez y conocimiento real, pero la indicación clínica siempre es del profesional que te atiende.',
  },
  {
    q: '¿Cuál es la diferencia entre un elixir simple y un blend?',
    a: 'El elixir simple es un hongo puro, de un solo origen, para cuando ya sabés que te funciona. El blend combina dos o tres en proporciones pensadas para un objetivo puntual: energía y enfoque, cognitivo y antiestrés, inmuno balance, descanso profundo.',
  },
  {
    q: '¿Hacen envíos a todo el país?',
    a: 'Sí, a todo el país. El envío se coordina por WhatsApp según tu provincia y el volumen del pedido. Estamos en Tucumán, así que varias zonas del NOA suelen llegar en 24 horas.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Efectivo o transferencia. Cuando armamos tu pedido te pasamos el detalle y el link de pago por el mismo chat. No guardamos datos de tarjeta ni procesamos pagos dentro de la web.',
  },
  {
    q: '¿Desde cuándo trabajan?',
    a: 'Nacimos en Tucumán con una idea simple: democratizar el acceso a los hongos medicinales de verdad. Elaboramos elixires con tecnología de cavitación acústica, sin dejar de contar la historia del hongo que estamos usando.',
  },
] as const

/* --------------------------------------------------------------------- */
/*  Franja de garantias / confianza                                        */
/* --------------------------------------------------------------------- */
export const PROMISES = [
  { t: 'Extracción cíclica', d: 'Triple extracción, fórmula concentrada' },
  { t: 'Envíos a todo el país', d: 'Tucumán, Salta, Córdoba y más' },
  { t: 'Pago en efectivo o transferencia', d: 'Te pasamos el link por WhatsApp' },
  { t: 'Sin estimulantes', d: 'Nada de cafeína ni activadores' },
  { t: 'Compra sin salir de casa', d: 'Armás el pedido acá y lo recibís' },
  { t: 'Asesoramiento real', d: 'Te contamos cómo sumarlo a tu rutina' },
] as const

/* --------------------------------------------------------------------- */
/*  Provincias                                                             */
/* --------------------------------------------------------------------- */
export const PROVINCES = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Corrientes', 'Córdoba',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
  'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
  'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tucumán',
  'Uruguay',
] as const