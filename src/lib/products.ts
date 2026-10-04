/* =========================================================================
   Catalogo — 15 productos, datos tomados del sistema real del negocio
   (nombre, descripcion, precio y stock verbatim; el resto es curacion)
   ========================================================================= */

export type Category = 'elixir' | 'blend'

export type Axis =
  | 'energia'
  | 'sueno'
  | 'estres'
  | 'mente'
  | 'defensas'
  | 'metabolismo'
  | 'piel'
  | 'digestion'
  | 'rendimiento'

export type Product = {
  slug: string
  name: string
  kicker: string
  category: Category
  price: number
  listPrice: number
  stock: number
  image: string
  /** Una linea para la tarjeta. */
  short: string
  /** Descripcion del catalogo original, sin recortes. */
  long: string[]
  highlights: string[]
  axes: Axis[]
  /** A quien le habla de vos. */
  para: string
  /** Acento cromatico para el halo de la tarjeta. */
  glow: string
  label: string
}

export const AXES: { id: Axis; label: string; hint: string }[] = [
  { id: 'energia', label: 'Me falta energía', hint: 'llegás a la tarde sin nada que te empuje' },
  { id: 'sueno', label: 'No duermo bien', hint: 'te acostás cansado y te levantás igual' },
  { id: 'estres', label: 'Estoy al límite', hint: 'el estrés ya es una constante' },
  { id: 'mente', label: 'Pierdo el foco', hint: 'rendís menos aunque descanses' },
  { id: 'defensas', label: 'Defensas bajas', hint: 'se te baja todo el tiempo' },
  { id: 'metabolismo', label: 'Metabolismo y hormonas', hint: 'se te desordena todo' },
  { id: 'piel', label: 'Piel y estética', hint: 'el desgaste se nota' },
  { id: 'digestion', label: 'Digestión pesada', hint: 'hinchazón, gastritis, intestino inflamado' },
  { id: 'rendimiento', label: 'Rendimiento físico', hint: 'entrenás y no llegás' },
]

export const CATEGORIES: { id: Category | 'all'; label: string; note: string }[] = [
  { id: 'all', label: 'Todo', note: '15 referencias' },
  { id: 'elixir', label: 'Elixires simples', note: '10 de un hongo puro' },
  { id: 'blend', label: 'Blends', note: '5 de dos o tres en proporción' },
]

export const PRODUCTS: Product[] = [
  {
    slug: 'melena-de-leon',
    name: 'Melena de León',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 21700,
    listPrice: 25000,
    stock: 242,
    image: '/media/p-melena-de-leon.webp',
    short: 'El hongo del pensamiento claro y del intestino tranquilo.',
    long: [
      'Regenera y fortalece el sistema nervioso. Mejora la memoria, la concentración y la claridad mental.',
      'También repara la mucosa intestinal: ayuda en gastritis, SIBO e intestino inflamado, con una digestión más liviana y menos hinchazón.',
      'En el día a día, brinda más enfoque, menos estrés y mejor funcionamiento cerebral.',
    ],
    highlights: [
      'Memoria, concentración y claridad mental',
      'Repara la mucosa intestinal',
      'Gastritis, SIBO e intestino inflamado',
    ],
    axes: ['mente', 'digestion', 'estres'],
    para: 'Si vivís con la cabeza a tope y el estómago a las corridas.',
    glow: '#C8A583',
    label: 'N° 01 · el más pedido',
  },
  {
    slug: 'reishi',
    name: 'Reishi',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 22100,
    listPrice: 25400,
    stock: 196,
    image: '/media/p-reishi.webp',
    short: 'El hongo de la calma. Baja el estrés y rehabilita el sueño.',
    long: [
      'Es el hongo del equilibrio y la calma. Regula el sistema nervioso, baja el estrés, mejora el sueño profundo y ayuda a manejar la ansiedad.',
      'También reduce la inflamación, mejora la circulación, apoya el sistema inmunológico y contribuye a un bienestar emocional más estable.',
      'Ideal para estrés crónico, insomnio, cansancio o inflamaciones frecuentes.',
    ],
    highlights: [
      'Suelo profundo y reparador',
      'Regula el sistema nervioso',
      'Apoya la circulación y la inmunidad',
    ],
    axes: ['sueno', 'estres', 'defensas'],
    para: 'Si el cuerpo te viene pidiendo una pausa.',
    glow: '#A8452F',
    label: 'N° 02 · triple extracción',
  },
  {
    slug: 'cordyceps',
    name: 'Cordyceps',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 22100,
    listPrice: 25400,
    stock: 165,
    image: '/media/p-cordyceps.webp',
    short: 'Energía limpia y sostenida, sin nerviosismo.',
    long: [
      'El hongo de la energía limpia. Mejora la oxigenación, aumenta la resistencia física, sube el rendimiento diario y combate el cansancio profundo.',
      'Regula el sistema respiratorio y equilibra la energía sin generar nerviosismo.',
      'Ideal para fatiga, baja energía, estrés físico o para rendir mejor durante el día.',
    ],
    highlights: [
      'Oxigenación y resistencia física',
      'Energía sin nerviosismo',
      'Sistema respiratorio',
    ],
    axes: ['energia', 'rendimiento', 'defensas'],
    para: 'Si entrenás, trabajás fuerte o llegás a la tarde sin nada.',
    glow: '#C9A227',
    label: 'N° 03 · el de la energía',
  },
  {
    slug: 'cola-de-pavo',
    name: 'Cola de Pavo',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 22100,
    listPrice: 25400,
    stock: 46,
    image: '/media/p-cola-de-pavo.webp',
    short: 'Defensas en alto, intestino y hígado en paz.',
    long: [
      'Fortalece profundamente el sistema inmune, equilibra la microbiota intestinal, reduce la inflamación digestiva y apoya la función hepática.',
      'Es muy estudiado por su capacidad de modular y acompañar al sistema inmunológico, por eso suele utilizarse como apoyo complementario en personas que atraviesan enfermedades complejas, incluido el cáncer, siempre junto al tratamiento médico correspondiente.',
      'Ideal para defensas bajas, digestión inflamada, SIBO, gastritis o necesidad de fortalecer inmunidad de manera natural.',
    ],
    highlights: [
      'Modula el sistema inmunitario',
      'Equilibra la microbiota intestinal',
      'Apoya la función hepática',
    ],
    axes: ['defensas', 'digestion', 'energia'],
    para: 'Si te enfermas cada dos por tres o venís arrastrando una inflamación.',
    glow: '#7D8C6A',
    label: 'N° 04 · pocas unidades',
  },
  {
    slug: 'shiitake',
    name: 'Shiitake',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 21700,
    listPrice: 25000,
    stock: 56,
    image: '/media/p-shiitake.webp',
    short: 'Circulación, hígado y colesterol en equilibrio.',
    long: [
      'Mejora la circulación, apoya la salud del hígado, refuerza el sistema inmune y contribuye al equilibrio del colesterol.',
      'Aporta vitaminas del grupo B para una energía diaria más estable y favorece una digestión más liviana.',
      'Puede ser un buen apoyo complementario en casos de anemia: mejora la absorción de nutrientes y acompaña la función hepática.',
      'Ideal para cansancio, defensas bajas, circulación lenta o apoyo natural a la salud metabólica y cardiovascular.',
    ],
    highlights: [
      'Mejora la circulación sanguínea',
      'Equilibrio del colesterol',
      'Soporte en casos de anemia',
    ],
    axes: ['metabolismo', 'defensas', 'energia'],
    para: 'Si te cuesta arrancar y sentís la circulación pesada.',
    glow: '#8B5E34',
    label: 'N° 05',
  },
  {
    slug: 'descanso-profundo',
    name: 'Descanso Profundo',
    kicker: 'Blend · 50 ml',
    category: 'blend',
    price: 31100,
    listPrice: 35800,
    stock: 163,
    image: '/media/p-descanso-profundo.webp',
    short: 'Sueño profundo y reparador. El cuerpo se relaja de verdad.',
    long: [
      'Promueve un sueño profundo y reparador, calma el sistema nervioso y ayuda a relajar el cuerpo.',
    ],
    highlights: ['Sueño profundo y reparador', 'Calma el sistema nervioso', 'Relaja el cuerpo entero'],
    axes: ['sueno', 'estres'],
    para: 'Si te acostás, contás las horas y te levantás peor.',
    glow: '#4A5C7A',
    label: 'N° 06 · el de la noche',
  },
  {
    slug: 'champignon-del-sol',
    name: 'Champiñón del Sol',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 27300,
    listPrice: 31400,
    stock: 53,
    image: '/media/p-champignon-del-sol.webp',
    short: 'El más completo. Antihistamínico natural y modulador inmunitario.',
    long: [
      'Fortalece el sistema inmune, regula la inflamación y mejora la respuesta del cuerpo frente a virus, bacterias y procesos crónicos.',
      'Ayuda a equilibrar la glucosa, mejora la energía diaria de forma suave y sostiene la salud metabólica.',
      'Actúa como antihistamínico natural, útil para alergias, rinitis, piel reactiva y procesos inflamatorios asociados a una respuesta inmunológica sobreactiva.',
      'Muy utilizado como acompañamiento natural en situaciones complejas, incluido cáncer, gracias a su acción moduladora del sistema inmune (siempre junto al tratamiento médico).',
    ],
    highlights: [
      'Antihistamínico natural (alergias y rinitis)',
      'Regula la inflamación',
      'Equilibra la glucosa',
    ],
    axes: ['defensas', 'metabolismo', 'piel'],
    para: 'Si las alergias o la piel reactiva se te van de las manos.',
    glow: '#D9A441',
    label: 'N° 07 · el más completo',
  },
  {
    slug: 'ashwagandha',
    name: 'Ashwagandha',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 24300,
    listPrice: 27900,
    stock: 188,
    image: '/media/p-ashwagandha.webp',
    short: 'El eje hipotálamo-hipófisis-adrenal, en calma.',
    long: [
      'Adaptógeno clave para equilibrar el sistema hormonal en general. Ayuda a regular el cortisol —la hormona del estrés—, mejora la respuesta del cuerpo ante los cambios hormonales y sostiene la vitalidad física y emocional.',
      'Acompaña menopausia, premenopausia, ciclos irregulares, agotamiento suprarrenal, tiroides sensible (hipotiroidismo) y etapas de mucho desgaste.',
      'Promueve un descanso más profundo, estabiliza el ánimo y aporta una energía más pareja durante el día, sin picos ni bajones.',
      'Ideal para armonizar hormonas, reducir estrés, mejorar el sueño y recuperar la estabilidad emocional.',
    ],
    highlights: [
      'Regula el cortisol',
      'Acompaña cambios hormonales',
      'Energía pareja, sin picos ni bajones',
    ],
    axes: ['estres', 'sueno', 'metabolismo'],
    para: 'Si te sentís mentalmente agotada pero no podés dormir.',
    glow: '#9C6B8E',
    label: 'N° 08 · el más elegido',
  },
  {
    slug: 'tremella',
    name: 'Tremella',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 21600,
    listPrice: 24800,
    stock: 76,
    image: '/media/p-tremella.webp',
    short: 'Colágeno y ácido hialurónico estimulados desde adentro.',
    long: [
      'Muy valorado por su capacidad de estimular la producción natural de colágeno y ácido hialurónico, mejorando la elasticidad, la firmeza y la hidratación profunda de la piel.',
      'Retiene gran cantidad de agua a nivel celular, dejando la piel más suave, luminosa y con aspecto descansado.',
      'Además calma la inflamación, repara mucosas y favorece la regeneración de tejidos, acompañando procesos de envejecimiento cutáneo de manera natural.',
    ],
    highlights: [
      'Colágeno + ácido hialurónico natural',
      'Piel luminosa y descansada',
      'Renueva mucosas y tejidos',
    ],
    axes: ['piel', 'digestion'],
    para: 'Si buscás piel hidratada desde adentro y no por fuera.',
    glow: '#E3CFA8',
    label: 'N° 09 · el de la piel',
  },
  {
    slug: 'rhodiola',
    name: 'Rhodiola',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 24300,
    listPrice: 27900,
    stock: 192,
    image: '/media/p-rhodiola.webp',
    short: 'Energía mental limpia. Enfoque sin sobreestimulación.',
    long: [
      'Aporta energía mental limpia y enfoque, mejorando la concentración, la memoria y el rendimiento en momentos de mucha exigencia.',
      'Regula la respuesta al estrés, equilibra el ánimo y reduce la sensación de agotamiento físico y emocional.',
      'Apoya el sistema hormonal del estrés y da una energía más estable, sin ansiedad ni sobreestimulación.',
    ],
    highlights: [
      'Energía mental sin sobreestimulación',
      'Concentración y memoria',
      'Estabiliza el ánimo',
    ],
    axes: ['energia', 'mente', 'estres'],
    para: 'Si tenés la cabeza llena y el cuerpo en modo ahorro.',
    glow: '#B5522F',
    label: 'N° 10 · sin cafeína',
  },
  {
    slug: 'maitake',
    name: 'Maitake',
    kicker: 'Elixir simple · 50 ml',
    category: 'elixir',
    price: 22800,
    listPrice: 26200,
    stock: 74,
    image: '/media/p-maitake.webp',
    short: 'Metabolismo, glucosa y hormonas en la misma línea.',
    long: [
      'Ayuda a equilibrar el metabolismo, mejorar la utilización de la glucosa y favorecer una energía más estable durante el día.',
      'Regula la respuesta inmune, reduce la inflamación y acompaña procesos hormonales, especialmente en casos de síndrome de ovario poliquístico (SOP), ciclos irregulares o desequilibrios metabólicos.',
      'Aporta vitalidad suave, mejora el ánimo y sostiene la recuperación general del organismo.',
    ],
    highlights: [
      'Equilibra glucosa y metabolismo',
      'Acompaña SOP y ciclos irregulares',
      'Reduce la inflamación',
    ],
    axes: ['metabolismo', 'energia', 'defensas'],
    para: 'Si el metabolismo y las hormonas se te desordenan juntos.',
    glow: '#6E7B4B',
    label: 'N° 11',
  },
  {
    slug: 'energia-y-rendimiento',
    name: 'Energía y Rendimiento',
    kicker: 'Blend · Rhodiola 50% · Cordyceps 50%',
    category: 'blend',
    price: 31400,
    listPrice: 36100,
    stock: 78,
    image: '/media/p-energia-y-rendimiento.webp',
    short: 'Rhodiola + Cordyceps: el dúo que potencia cuerpo y mente.',
    long: [
      'Combina dos adaptógenos clave para elevar la energía física, mejorar la oxigenación y potenciar el rendimiento diario y deportivo.',
      'Rhodiola aumenta la energía vital, mejora la resistencia al estrés físico y mental y sostiene el esfuerzo sin agotamiento.',
      'Cordyceps optimiza la oxigenación celular, potencia la capacidad pulmonar y la resistencia física, con energía limpia y duradera.',
      'Ideal para mejorar rendimiento físico, aumentar energía, apoyar la actividad deportiva y combatir el cansancio crónico.',
    ],
    highlights: [
      'Oxigenación celular y capacidad pulmonar',
      'Sin nerviosismo, sin agotamiento',
      'Pensado para el deporte',
    ],
    axes: ['energia', 'rendimiento', 'mente'],
    para: 'Si entrenás y querés rendir sin vaciarte.',
    glow: '#C9A227',
    label: 'Blend 01 · el más vendido',
  },
  {
    slug: 'energia-y-enfoque',
    name: 'Energía y Enfoque',
    kicker: 'Blend · Rhodiola 50% · Melena de León 50%',
    category: 'blend',
    price: 31200,
    listPrice: 35900,
    stock: 96,
    image: '/media/p-energia-y-enfoque.webp',
    short: 'Para estudiar, trabajar y no perder el hilo.',
    long: [
      'Combina dos adaptógenos que trabajan juntos para elevar la energía vital y potenciar el rendimiento mental de forma limpia y sostenida.',
      'Rhodiola aporta energía natural, mejora la motivación y la resistencia al estrés, sin agotarse.',
      'Melena de León fortalece la función cognitiva: claridad mental, memoria, enfoque sostenido y conexión mente-cuerpo.',
      'Ideal para cansancio mental, jornadas de alta exigencia, estudio o trabajo intenso.',
    ],
    highlights: [
      'Energía estable, sin nerviosismo',
      'Enfoque sostenido y memoria',
      'Para estudiar o trabajar',
    ],
    axes: ['energia', 'mente', 'estres'],
    para: 'Si tu trabajo es mental y a las cuatro de la tarde no existís.',
    glow: '#B08D57',
    label: 'Blend · 02',
  },
  {
    slug: 'cognitivo-y-antiestres',
    name: 'Cognitivo y Antiestrés',
    kicker: 'Blend · Melena de León 40% · Ashwagandha 40% · Reishi 20%',
    category: 'blend',
    price: 32400,
    listPrice: 37300,
    stock: 127,
    image: '/media/p-cognitivo-y-antiestres.webp',
    short: 'Mente clara, estrés cero. El blend más completo.',
    long: [
      'Formulado para potenciar la claridad mental y reducir el estrés desde un enfoque natural y equilibrado.',
      'Melena de León es la base: mejora la conexión neuronal, apoya la memoria y aumenta el enfoque sostenido.',
      'Ashwagandha trabaja sobre el sistema hormonal del estrés, regula el cortisol, estabiliza el ánimo y aporta energía tranquila y pareja.',
      'Reishi en proporción suave complementa con un fondo de calma, sin sedación.',
      'Ideal para exigencia mental, estrés acumulado, sobrepensamiento o necesidad de rendimiento cognitivo sin ansiedad.',
    ],
    highlights: [
      'Tres hongos, un objetivo',
      'Calma de fondo sin sedación',
      'Rendimiento cognitivo sin ansiedad',
    ],
    axes: ['mente', 'estres', 'sueno'],
    para: 'Si pensás demasiado y al mismo tiempo no rendís.',
    glow: '#7E8CA8',
    label: 'Blend · 03 · el más completo',
  },
  {
    slug: 'inmuno-balance',
    name: 'Inmuno Balance',
    kicker: 'Blend · Cola de Pavo 40% · Champiñón del Sol 40% · Maitake 20%',
    category: 'blend',
    price: 34000,
    listPrice: 39100,
    stock: 73,
    image: '/media/p-inmuno-balance.webp',
    short: 'Defensas, inflamación y energía estable en un solo frasco.',
    long: [
      'Reúne tres hongos medicinales conocidos por fortalecer el sistema inmune, modular la inflamación y brindar energía equilibrada.',
      'Cola de Pavo apoya profundamente la inmunidad, equilibra la microbiota y reduce la inflamación digestiva.',
      'Champiñón del Sol fortalece la respuesta inmunológica, actúa como antihistamínico natural y acompaña procesos inflamatorios complejos.',
      'Maitake, en proporción suave, mejora el metabolismo, la energía estable y la regulación del sistema inmune.',
      'Ideal para defensas bajas, alergias, inflamación crónica, digestión sensible o estrés físico.',
    ],
    highlights: [
      'Tres hongos, equilibrio completo',
      'Antihistamínico natural incluido',
      'Defensas + inflamación + energía',
    ],
    axes: ['defensas', 'digestion', 'metabolismo'],
    para: 'Si te enfermás cada invierno y no lo vivías bien.',
    glow: '#5F7A55',
    label: 'Blend · 04 · el más completo',
  },
]

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)

export const discountPct = (p: Product) =>
  Math.round(((p.listPrice - p.price) / p.listPrice) * 100)