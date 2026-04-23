export const MODEL_PATH = 'https://huggingface.co/datasets/alx-dot-wav/anatomia-equina-assets/resolve/main/caballo.glb';

export const ANATOMICAL_SYSTEMS = {
  exterior: {
    id: "exterior",
    label: "Exterior",
    icon: "Capas",
    hotspots: [
      { id: "ext_cabeza", frac: [0.65, 0.87, 0.91], key: "cabeza" },
      { id: "ext_cuello", frac: [0.43, 0.66, 0.78], key: "cuello" },
      { id: "ext_abdomen", frac: [0.12, 0.56, 0.45], key: "abdomen" },
      { id: "ext_cuarto_trasero", frac: [0.02, 0.59, 0.20], key: "cuartoTrasero" },
      { id: "ext_pecho", frac: [0.10, 0.58, 0.68], key: "pecho" },
      { id: "ext_pierna_trasera", frac: [0.22, 0.26, 0.11], key: "cuartoTrasero" },
      { id: "ext_pierna_delantera", frac: [0.28, 0.23, 0.66], key: "pataDelantera" }
    ],
    data: {
      cabeza: {
        label: "Cabeza", category: "Estructura Craneal", type: "structure",
        description: "La cabeza del caballo alberga los principales órganos sensoriales y neurológicos. Comprende el cráneo, los maxilares, la cavidad nasal y la región oral.",
        facts: [{ label:"Peso aprox.", value:"~5–6 kg" },{ label:"Huesos", value:"34 huesos" },{ label:"Longitud", value:"~60 cm" },{ label:"Vol. craneal", value:"~550 ml" }],
        subparts: ["Cerebro","Ojos","Oídos","Cavidad Nasal","Maxilar","Mandíbula","Lengua","Dientes"],
        clinical: "La evaluación neurológica de la cabeza incluye reflejos pupilares, simetría facial y respuesta a estímulos. Las fracturas del hueso nasal son frecuentes en caídas."
      },
      cuello: {
        label: "Cuello", category: "Columna Cervical", type: "structure",
        description: "El cuello equino contiene 7 vértebras cervicales y es el segmento más móvil de la columna. Permite amplio rango de movimiento para el pastoreo y la locomoción.",
        facts: [{ label:"Vértebras", value:"7 (C1–C7)" },{ label:"Longitud", value:"~80–100 cm" },{ label:"Músculos", value:">20 grupos" },{ label:"Flexión", value:"±120°" }],
        subparts: ["Atlas (C1)","Axis (C2)","Ligamento Nucal","Tráquea","Esófago","Carótida","Yugular"],
        clinical: "La articulación atlantoaxial es punto frecuente de patología. El ligamento nucal es esencial para la estática de la cabeza en reposo."
      },
      dorso: {
        label: "Dorso / Lomo", category: "Columna Torácica–Lumbar", type: "structure",
        description: "Región que comprende las vértebras torácicas (T1–T18) y lumbares (L1–L6). Es la zona de transmisión de fuerzas entre cuartos traseros y delanteros durante el movimiento.",
        facts: [{ label:"Vértebras T", value:"18 torácicas" },{ label:"Vértebras L", value:"6 lumbares" },{ label:"Costillas", value:"18 pares" },{ label:"Long. aprox.", value:"~130–150 cm" }],
        subparts: ["Apófisis espinosas","Costillas","Disco intervertebral","Músc. longísimo","Aorta dorsal"],
        clinical: "El síndrome de dorso doloroso es una de las causas más comunes de bajo rendimiento atlético. La evaluación incluye palpación de apófisis espinosas y pruebas de flexión."
      },
      pecho: {
        label: "Pecho / Tórax", category: "Sistema Cardiorrespiratorio", type: "system",
        description: "La cavidad torácica aloja los pulmones, el corazón y los grandes vasos. La capacidad pulmonar del caballo atlético es de las mayores entre los mamíferos terrestres.",
        facts: [{ label:"Vol. pulmonar", value:"~42 litros" },{ label:"FC reposo", value:"28–44 lpm" },{ label:"FC ejercicio", value:"hasta 240 lpm" },{ label:"FR reposo", value:"8–16 rpm" }],
        subparts: ["Corazón","Pulmón izquierdo","Pulmón derecho","Aorta","Vena cava","Bronquios","Pleura"],
        clinical: "El sangrado pulmonar inducido por ejercicio (EIPH) afecta hasta el 80% de caballos de carrera. La auscultación cardíaca evalúa soplos y arritmias frecuentes en competición."
      },
      abdomen: {
        label: "Abdomen", category: "Sistema Digestivo", type: "system",
        description: "El aparato digestivo del caballo es monogástrico con ciego y colon muy desarrollados. El tránsito total del alimento dura entre 36 y 72 horas.",
        facts: [{ label:"Long. intestinal", value:"~25–30 m" },{ label:"Vol. estómago", value:"~8–15 L" },{ label:"Vol. ciego", value:"~25–30 L" },{ label:"Vol. colon", value:"~80–130 L" }],
        subparts: ["Estómago","Intestino delgado","Ciego","Colon mayor","Colon menor","Hígado","Bazo","Riñones"],
        clinical: "El cólico es la principal causa de muerte en équidos. El diagnóstico incluye auscultación de borborigmos, palpación rectal y análisis del líquido peritoneal."
      },
      cuartoTrasero: {
        label: "Cuarto Trasero", category: "Aparato Locomotor", type: "structure",
        description: "El cuarto trasero genera la mayor parte de la propulsión en el movimiento equino. Incluye la pelvis, el fémur, tibia y la compleja articulación del corvejón.",
        facts: [{ label:"Músc. glúteo", value:"~15 kg c/u" },{ label:"Articulaciones", value:"Cadera, Rodilla, Corvejón" },{ label:"Fuerza impulso", value:"mayor propulsor" },{ label:"Hueso fémur", value:"~43 cm long." }],
        subparts: ["Pelvis / Ilion","Fémur","Tibia / Peroné","Corvejón (Tarso)","Metatarso","Menudillo","Casco"],
        clinical: "La enfermedad del corvejón (esparaván óseo) y la ruptura del ligamento plantar son patologías frecuentes en caballos de deporte."
      },
      pataDelantera: {
        label: "Extremidad Delantera", category: "Aparato Locomotor", type: "structure",
        description: "Las extremidades delanteras soportan ~60% del peso corporal. La escápula flota sobre la pared torácica sin articulación ósea con el tronco, absorbiendo impactos.",
        facts: [{ label:"Peso soportado", value:"~60% corporal" },{ label:"Articulaciones", value:"Hombro, Codo, Rodilla" },{ label:"Metacarpo", value:"Caña + 2 huesos pequeños" },{ label:"Casco", value:"~500 g peso" }],
        subparts: ["Escápula","Húmero","Radio / Cúbito","Rodilla (Carpo)","Metacarpo","Menudillo","Cuartilla","Casco"],
        clinical: "Las fracturas de tercer metacarpo (caña) son emergencias ortopédicas. Las laminitis y enfermedad navicular son las causas más comunes de claudicación crónica."
      },
      casco: {
        label: "Casco", category: "Órgano Digital", type: "vital",
        description: "El casco es una estructura de queratina que protege y amortigua las estructuras digitales. 'No hay casco, no hay caballo' — su integridad es fundamental para la locomoción.",
        facts: [{ label:"Material", value:"Queratina" },{ label:"Crec. mensual", value:"~1 cm/mes" },{ label:"Herraje", value:"c/ 6–8 semanas" },{ label:"Temp. normal", value:"<32°C" }],
        subparts: ["Muralla","Suela","Ranilla","Línea blanca","Hueso pedal (P3)","Hueso navicular","Laminillas"],
        clinical: "La laminitis (infosura) es inflamación de las laminillas dérmicas. Puede progresar a rotación o hundimiento del hueso pedal. Emergencia veterinaria."
      }
    }
  },
  muscular: {
    id: "muscular",
    label: "Muscular",
    icon: "Tejido",
    hotspots: [
      { id: "musc_cuello", frac: [0.45, 0.70, 0.75], key: "braquiocefalico" }
    ],
    data: {
      braquiocefalico: {
        label: "Músculo Braquiocefálico", category: "Musculatura Cervical", type: "muscle",
        description: "Músculo largo que va desde la cabeza hasta el brazo. Es el principal extensor del cuello y flexor del hombro.",
        facts: [{ label:"Función", value:"Avance de la extremidad" },{ label:"Ubicación", value:"Lateral del cuello" }],
        subparts: ["Porción cleidomastoidea", "Porción cleidooccipital", "Porción cleidobraquial"],
        clinical: "Suele tensarse o lesionarse en caballos que tiran fuertemente o tienen problemas de embocadura."
      }
    }
  },
  esqueleto: {
    id: "esqueleto",
    label: "Esqueleto",
    icon: "Óseo",
    hotspots: [
      { id: "esq_escapula", frac: [0.25, 0.60, 0.60], key: "escapula" }
    ],
    data: {
      escapula: {
        label: "Escápula", category: "Esqueleto Apendicular", type: "bone",
        description: "Hueso plano y triangular que forma la base del hombro. En los caballos, no está unida al tronco por ninguna articulación ósea, sino por un cabestrillo muscular.",
        facts: [{ label:"Tipo", value:"Hueso plano" },{ label:"Articulación", value:"Escapulohumeral" }],
        subparts: ["Espina escapular", "Cartílago escapular", "Cavidad glenoidea"],
        clinical: "El cartílago escapular puede osificarse parcialmente con la edad."
      }
    }
  },
  respiratorio: {
    id: "respiratorio",
    label: "Respiratorio",
    icon: "Resp.",
    meshNames: ["larinje", "pulmon", "traquea"],
    hotspots: [
      { id: "resp_laringe",     frac: [0.494, 0.696, 0.745], key: "laringe" },
      { id: "resp_traquea",     frac: [0.539, 0.742, 0.732], key: "traquea" },
      { id: "resp_pulmon_izq", frac: [0.661, 0.462, 0.521], key: "pulmonIzquierdo" },
      { id: "resp_pulmon_der", frac: [0.325, 0.465, 0.504], key: "pulmonDerecho" }
    ],
    data: {
      laringe: {
        label: "Laringe", category: "Via Aerea Superior", type: "structure",
        description: "La laringe equina es una estructura cartilaginosa que conecta la faringe con la tráquea. Regula el flujo de aire, protege la vía aérea durante la deglución y participa en la fonación. El caballo es respirador nasal obligado, por lo que la integridad de la laringe es crítica para el rendimiento atlético.",
        facts: [
          { label: "Cartílagos", value: "Tiroides, Cricoides, Aritenoides (par), Epiglotis" },
          { label: "Longitud", value: "~8–10 cm" },
          { label: "Función", value: "Regulacion de flujo aéreo" },
          { label: "Posición", value: "Caudal a la faringe" }
        ],
        subparts: ["Epiglotis", "Cartílago aritenoides (D/I)", "Cartílago tiroides", "Cartílago cricoides", "Pliegues vocales", "Músculo cricoaritenoideo dorsal"],
        clinical: "La hemiplejia laríngea recurrente (parálisis del nervio laríngeo recurrente izquierdo) es una de las patologías respiratorias más frecuentes en caballos de alto rendimiento. Clínicamente se ausculta como un 'roar' o silbido inspiratorio. El tratamiento incluye la laringoplastia (tie-back) y/o la ventriculocordectomía."
      },
      traquea: {
        label: "Tráquea", category: "Via Aerea Superior", type: "structure",
        description: "Tubo fibrocartilaginoso que conduce el aire desde la laringe hasta la bifurcación bronquial (carina). Está formada por 48–60 anillos cartilaginosos en C conectados por músculo traqueal. Representa la principal vía de paso de aire hacia los pulmones.",
        facts: [
          { label: "Anillos cart.", value: "48–60 anillos en C" },
          { label: "Longitud", value: "~70–80 cm" },
          { label: "Diámetro", value: "~5–6 cm" },
          { label: "Bifurcación", value: "A nivel de T5 (carina)" }
        ],
        subparts: ["Anillos cartilaginosos", "Músculo traqueal", "Mucosa traqueal", "Glándulas traqueales", "Carina"],
        clinical: "La traqueítis bacteriana y la acumulación de moco son hallazgos frecuentes en el síndrome inflamatorio de las vías respiratorias (IRAP/IAD). El lavado traqueobronquial (BAL) se utiliza para el diagnóstico citológico. La traqueostomía de emergencia puede salvar la vida en obstrucciones superiores agudas."
      },
      pulmonIzquierdo: {
        label: "Pulmón Izquierdo", category: "Sistema Respiratorio", type: "vital",
        description: "El pulmón izquierdo equino consta de dos lóbulos (craneal y caudal) y ocupa la cavidad pleural izquierda. Durante el ejercicio, la ventilación pulmonar puede alcanzar 1.200–1.800 L/min, lo que exige una integridad estructural máxima de los alvéolos y capilares pulmonares.",
        facts: [
          { label: "Lóbulos", value: "Craneal y Caudal" },
          { label: "Vol. aprox.", value: "~20 litros" },
          { label: "Alvéolos", value: "~500 millones" },
          { label: "Superficie de intercambio", value: "~100–120 m²" }
        ],
        subparts: ["Lóbulo craneal", "Lóbulo caudal", "Pleura visceral", "Bronquio principal izquierdo", "Bronquiolos", "Alvéolos", "Capilares pulmonares"],
        clinical: "El sangrado pulmonar inducido por ejercicio (EIPH) afecta al 70–90% de los caballos de carrera. Se origina principalmente en el lóbulo caudal dorsal del pulmón izquierdo. La endoscopía post-ejercicio y la broncoscopía confirman el diagnóstico. El furosemide preejercicio reduce la incidencia."
      },
      pulmonDerecho: {
        label: "Pulmón Derecho", category: "Sistema Respiratorio", type: "vital",
        description: "El pulmón derecho equino tiene tres lóbulos (craneal, medio y caudal), lo que lo hace ligeramente más voluminoso que el izquierdo. Junto con el pulmón izquierdo, garantiza la oxigenación de hasta 75 litros de sangre por minuto durante el ejercicio máximo.",
        facts: [
          { label: "Lóbulos", value: "Craneal, Medio y Caudal" },
          { label: "Vol. aprox.", value: "~22 litros" },
          { label: "Frecuencia resp.", value: "8–16 rpm (reposo)" },
          { label: "FR en ejercicio", value: "hasta 130 rpm" }
        ],
        subparts: ["Lóbulo craneal", "Lóbulo medio", "Lóbulo caudal", "Pleura visceral", "Bronquio principal derecho", "Bronquiolos", "Alvéolos"],
        clinical: "La pleuroneumonía (pleuritis) es una emergencia veterinaria que cursa con acumulación de líquido en la cavidad pleural derecha. Se diagnostica por ultrasonografía torácica. El lóbulo caudal derecho es el más afectado en casos de neumonía por aspiración en potros."
      }
    }
  },
  bronquios: {
    id: "bronquios",
    label: "Bronquios",
    icon: "Bronq.",
    meshNames: ["bronquios"],
    hotspots: [
      { id: "bronq_principal", frac: [0.515, 0.606, 0.610], key: "arbolBronquial" }
    ],
    data: {
      arbolBronquial: {
        label: "Árbol Bronquial", category: "Sistema Respiratorio", type: "system",
        description: "El árbol bronquial equino comprende los bronquios principales (derecho e izquierdo), los bronquios lobares, segmentarios y subsegmentarios, hasta los bronquiolos terminales y respiratorios. Esta red distribuye el aire a los aproximadamente 500 millones de alvéolos pulmonares de cada pulmón.",
        facts: [
          { label: "Bronquios principales", value: "2 (derecho e izquierdo)" },
          { label: "Generaciones", value: "~25–30 ramificaciones" },
          { label: "Diámetro bronquio ppal.", value: "~3–4 cm" },
          { label: "Células ciliadas", value: "Escalera mucociliar activa" }
        ],
        subparts: ["Bronquio principal derecho", "Bronquio principal izquierdo", "Bronquios lobares", "Bronquios segmentarios", "Bronquiolos terminales", "Bronquiolos respiratorios", "Conductos alveolares"],
        clinical: "La enfermedad inflamatoria de las vías aéreas (IAD) y la enfermedad pulmonar obstructiva recurrente (EPOR/RAO), equivalente al asma equino, afectan principalmente a bronquios y bronquiolos. La broncoconstricción, hipersecreción mucosa y remodelado bronquial son los hallazgos predominantes. El diagnóstico se confirma por citología del lavado broncoalveolar (BAL)."
      }
    }
  }
};
