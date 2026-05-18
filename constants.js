export const MODEL_PATH =
	"https://huggingface.co/datasets/alx-dot-wav/anatomia-equina-assets/resolve/main/caballo.glb";

export const ALVEOLO_MODEL_PATH =
	"https://huggingface.co/datasets/alx-dot-wav/anatomia-equina-assets/resolve/main/Modelado5%20nueva%20animacion.glb";

export const ANATOMICAL_SYSTEMS = {
	exterior: {
		id: "exterior",
		label: "Exterior",
		icon: "Capas",
		hotspots: [
			{ id: "ext_cabeza", frac: [0.65, 0.87, 0.91], key: "cabeza" },
			{ id: "ext_cuello", frac: [0.43, 0.66, 0.78], key: "cuello" },
			{ id: "ext_abdomen", frac: [0.12, 0.56, 0.45], key: "abdomen" },
			{
				id: "ext_cuarto_trasero",
				frac: [0.02, 0.59, 0.2],
				key: "cuartoTrasero",
			},
			{ id: "ext_pecho", frac: [0.1, 0.58, 0.68], key: "pecho" },
			{
				id: "ext_pierna_trasera",
				frac: [0.22, 0.26, 0.11],
				key: "cuartoTrasero",
			},
			{
				id: "ext_pierna_delantera",
				frac: [0.28, 0.23, 0.66],
				key: "pataDelantera",
			},
		],
		data: {
			cabeza: {
				label: "Cabeza",
				category: "Estructura Craneal",
				type: "structure",
				description:
					"La cabeza del caballo alberga los principales órganos sensoriales y neurológicos. Comprende el cráneo, los maxilares, la cavidad nasal y la región oral.",
				facts: [
					{ label: "Peso aprox.", value: "~5–6 kg" },
					{ label: "Huesos", value: "34 huesos" },
					{ label: "Longitud", value: "~60 cm" },
					{ label: "Vol. craneal", value: "~550 ml" },
				],
				subparts: [
					"Cerebro",
					"Ojos",
					"Oídos",
					"Cavidad Nasal",
					"Maxilar",
					"Mandíbula",
					"Lengua",
					"Dientes",
				],
				clinical:
					"La evaluación neurológica de la cabeza incluye reflejos pupilares, simetría facial y respuesta a estímulos. Las fracturas del hueso nasal son frecuentes en caídas.",
			},
			cuello: {
				label: "Cuello",
				category: "Columna Cervical",
				type: "structure",
				description:
					"El cuello equino contiene 7 vértebras cervicales y es el segmento más móvil de la columna. Permite amplio rango de movimiento para el pastoreo y la locomoción.",
				facts: [
					{ label: "Vértebras", value: "7 (C1–C7)" },
					{ label: "Longitud", value: "~80–100 cm" },
					{ label: "Músculos", value: ">20 grupos" },
					{ label: "Flexión", value: "±120°" },
				],
				subparts: [
					"Atlas (C1)",
					"Axis (C2)",
					"Ligamento Nucal",
					"Tráquea",
					"Esófago",
					"Carótida",
					"Yugular",
				],
				clinical:
					"La articulación atlantoaxial es punto frecuente de patología. El ligamento nucal es esencial para la estática de la cabeza en reposo.",
			},
			dorso: {
				label: "Dorso / Lomo",
				category: "Columna Torácica–Lumbar",
				type: "structure",
				description:
					"Región que comprende las vértebras torácicas (T1–T18) y lumbares (L1–L6). Es la zona de transmisión de fuerzas entre cuartos traseros y delanteros durante el movimiento.",
				facts: [
					{ label: "Vértebras T", value: "18 torácicas" },
					{ label: "Vértebras L", value: "6 lumbares" },
					{ label: "Costillas", value: "18 pares" },
					{ label: "Long. aprox.", value: "~130–150 cm" },
				],
				subparts: [
					"Apófisis espinosas",
					"Costillas",
					"Disco intervertebral",
					"Músc. longísimo",
					"Aorta dorsal",
				],
				clinical:
					"El síndrome de dorso doloroso es una de las causas más comunes de bajo rendimiento atlético. La evaluación incluye palpación de apófisis espinosas y pruebas de flexión.",
			},
			pecho: {
				label: "Pecho / Tórax",
				category: "Sistema Cardiorrespiratorio",
				type: "system",
				description:
					"La cavidad torácica aloja los pulmones, el corazón y los grandes vasos. La capacidad pulmonar del caballo atlético es de las mayores entre los mamíferos terrestres.",
				facts: [
					{ label: "Vol. pulmonar", value: "~42 litros" },
					{ label: "FC reposo", value: "28–44 lpm" },
					{ label: "FC ejercicio", value: "hasta 240 lpm" },
					{ label: "FR reposo", value: "8–16 rpm" },
				],
				subparts: [
					"Corazón",
					"Pulmón izquierdo",
					"Pulmón derecho",
					"Aorta",
					"Vena cava",
					"Bronquios",
					"Pleura",
				],
				clinical:
					"El sangrado pulmonar inducido por ejercicio (EIPH) afecta hasta el 80% de caballos de carrera. La auscultación cardíaca evalúa soplos y arritmias frecuentes en competición.",
			},
			abdomen: {
				label: "Abdomen",
				category: "Sistema Digestivo",
				type: "system",
				description:
					"El aparato digestivo del caballo es monogástrico con ciego y colon muy desarrollados. El tránsito total del alimento dura entre 36 y 72 horas.",
				facts: [
					{ label: "Long. intestinal", value: "~25–30 m" },
					{ label: "Vol. estómago", value: "~8–15 L" },
					{ label: "Vol. ciego", value: "~25–30 L" },
					{ label: "Vol. colon", value: "~80–130 L" },
				],
				subparts: [
					"Estómago",
					"Intestino delgado",
					"Ciego",
					"Colon mayor",
					"Colon menor",
					"Hígado",
					"Bazo",
					"Riñones",
				],
				clinical:
					"El cólico es la principal causa de muerte en équidos. El diagnóstico incluye auscultación de borborigmos, palpación rectal y análisis del líquido peritoneal.",
			},
			cuartoTrasero: {
				label: "Cuarto Trasero",
				category: "Aparato Locomotor",
				type: "structure",
				description:
					"El cuarto trasero genera la mayor parte de la propulsión en el movimiento equino. Incluye la pelvis, el fémur, tibia y la compleja articulación del corvejón.",
				facts: [
					{ label: "Músc. glúteo", value: "~15 kg c/u" },
					{
						label: "Articulaciones",
						value: "Cadera, Rodilla, Corvejón",
					},
					{ label: "Fuerza impulso", value: "mayor propulsor" },
					{ label: "Hueso fémur", value: "~43 cm long." },
				],
				subparts: [
					"Pelvis / Ilion",
					"Fémur",
					"Tibia / Peroné",
					"Corvejón (Tarso)",
					"Metatarso",
					"Menudillo",
					"Casco",
				],
				clinical:
					"La enfermedad del corvejón (esparaván óseo) y la ruptura del ligamento plantar son patologías frecuentes en caballos de deporte.",
			},
			pataDelantera: {
				label: "Extremidad Delantera",
				category: "Aparato Locomotor",
				type: "structure",
				description:
					"Las extremidades delanteras soportan ~60% del peso corporal. La escápula flota sobre la pared torácica sin articulación ósea con el tronco, absorbiendo impactos.",
				facts: [
					{ label: "Peso soportado", value: "~60% corporal" },
					{ label: "Articulaciones", value: "Hombro, Codo, Rodilla" },
					{ label: "Metacarpo", value: "Caña + 2 huesos pequeños" },
					{ label: "Casco", value: "~500 g peso" },
				],
				subparts: [
					"Escápula",
					"Húmero",
					"Radio / Cúbito",
					"Rodilla (Carpo)",
					"Metacarpo",
					"Menudillo",
					"Cuartilla",
					"Casco",
				],
				clinical:
					"Las fracturas de tercer metacarpo (caña) son emergencias ortopédicas. Las laminitis y enfermedad navicular son las causas más comunes de claudicación crónica.",
			},
			casco: {
				label: "Casco",
				category: "Órgano Digital",
				type: "vital",
				description:
					"El casco es una estructura de queratina que protege y amortigua las estructuras digitales. 'No hay casco, no hay caballo' — su integridad es fundamental para la locomoción.",
				facts: [
					{ label: "Material", value: "Queratina" },
					{ label: "Crec. mensual", value: "~1 cm/mes" },
					{ label: "Herraje", value: "c/ 6–8 semanas" },
					{ label: "Temp. normal", value: "<32°C" },
				],
				subparts: [
					"Muralla",
					"Suela",
					"Ranilla",
					"Línea blanca",
					"Hueso pedal (P3)",
					"Hueso navicular",
					"Laminillas",
				],
				clinical:
					"La laminitis (infosura) es inflamación de las laminillas dérmicas. Puede progresar a rotación o hundimiento del hueso pedal. Emergencia veterinaria.",
			},
		},
	},
	muscular: {
		id: "muscular",
		label: "Muscular",
		icon: "Tejido",
		hotspots: [
			{
				id: "musc_cuello",
				frac: [0.45, 0.7, 0.75],
				key: "braquiocefalico",
			},
		],
		data: {
			braquiocefalico: {
				label: "Músculo Braquiocefálico",
				category: "Musculatura Cervical",
				type: "muscle",
				description:
					"Músculo largo que va desde la cabeza hasta el brazo. Es el principal extensor del cuello y flexor del hombro.",
				facts: [
					{ label: "Función", value: "Avance de la extremidad" },
					{ label: "Ubicación", value: "Lateral del cuello" },
				],
				subparts: [
					"Porción cleidomastoidea",
					"Porción cleidooccipital",
					"Porción cleidobraquial",
				],
				clinical:
					"Suele tensarse o lesionarse en caballos que tiran fuertemente o tienen problemas de embocadura.",
			},
		},
	},
	esqueleto: {
		id: "esqueleto",
		label: "Esqueleto",
		icon: "Óseo",
		hotspots: [
			{ id: "esq_escapula", frac: [0.25, 0.6, 0.6], key: "escapula" },
		],
		data: {
			escapula: {
				label: "Escápula",
				category: "Esqueleto Apendicular",
				type: "bone",
				description:
					"Hueso plano y triangular que forma la base del hombro. En los caballos, no está unida al tronco por ninguna articulación ósea, sino por un cabestrillo muscular.",
				facts: [
					{ label: "Tipo", value: "Hueso plano" },
					{ label: "Articulación", value: "Escapulohumeral" },
				],
				subparts: [
					"Espina escapular",
					"Cartílago escapular",
					"Cavidad glenoidea",
				],
				clinical:
					"El cartílago escapular puede osificarse parcialmente con la edad.",
			},
		},
	},
	respiratorio: {
		id: "respiratorio",
		label: "Respiratorio",
		icon: "Resp.",
		meshNames: ["larinje", "pulmon", "traquea", "alveolos"],
		hotspots: [
			{ id: "resp_laringe", frac: [0.494, 0.696, 0.745], key: "laringe" },
			{ id: "resp_traquea", frac: [0.539, 0.742, 0.732], key: "traquea" },
			{
				id: "resp_pulmon_izq",
				frac: [0.661, 0.462, 0.521],
				key: "pulmonIzquierdo",
			},
			{
				id: "resp_pulmon_der",
				frac: [0.325, 0.465, 0.504],
				key: "pulmonDerecho",
			},
			{
				id: "resp_intercambio",
				frac: [0.493, 0.6, 0.512],
				key: "intercambioGaseoso",
			},
			{ id: "resp_alveolos", frac: [0.45, 0.55, 0.48], key: "alveolos" },
		],
		data: {
			laringe: {
				label: "Laringe",
				category: "Via Aerea Superior",
				type: "structure",
				description:
					"La laringe equina es una estructura cartilaginosa que conecta la faringe con la tráquea. Regula el flujo de aire, protege la vía aérea durante la deglución y participa en la fonación. El caballo es respirador nasal obligado, por lo que la integridad de la laringe es crítica para el rendimiento atlético.",
				facts: [
					{
						label: "Cartílagos",
						value: "Tiroides, Cricoides, Aritenoides (par), Epiglotis",
					},
					{ label: "Longitud", value: "~8–10 cm" },
					{ label: "Función", value: "Regulación de flujo aéreo" },
					{ label: "Posición", value: "Caudal a la faringe" },
				],
				subparts: [
					"Epiglotis",
					"Cartílago aritenoides (D/I)",
					"Cartílago tiroides",
					"Cartílago cricoides",
					"Pliegues vocales",
					"Músculo cricoaritenoideo dorsal",
				],
				clinical:
					"La hemiplejia laríngea recurrente (parálisis del nervio laríngeo recurrente izquierdo) es una de las patologías respiratorias más frecuentes en caballos de alto rendimiento. Clínicamente se ausculta como un 'roar' o silbido inspiratorio. El tratamiento incluye la laringoplastia (tie-back) y/o la ventriculocordectomía.",
			},
			traquea: {
				label: "Tráquea",
				category: "Via Aerea Superior",
				type: "structure",
				description:
					"Se trata de un conducto de forma cilíndrica que permite el paso del aire que conecta con órganos esenciales del sistema respiratorio como la laringe, los bronquios y los pulmones.",
				facts: [
					{ label: "Anillos cart.", value: "50–60 anillos cartilaginosos" },
					{ label: "Longitud", value: "75–80 cm" },
					{ label: "Forma", value: "Cilíndrica (varía por porción)" },
				],
				subparts: [
					"Anillos cartilaginosos",
					"Músculo traqueal",
					"Mucosa traqueal",
					"Glándulas traqueales",
					"Carina",
				],
				clinical:
					"Traqueotomía: procedimiento quirúrgico llevado a cabo principalmente para establecer una vía respiratoria alternativa de emergencia o temporal, lo que permite que el aire pase directamente a la tráquea cuando hay alguna obstrucción grave en las vías respiratorias superiores.",
				species: [
					{ name: "Caballo", diff: "Tiene 50-60 anillos traqueales y una longitud de 75-80 cm, forma cilíndrica, aunque esta varía de acuerdo con sus dos porciones en las que se divide." },
					{ name: "Vaca", diff: "Longitud media de 65 cm, la bifurcación se halla a nivel de la 5ta. costilla y se adhiere al pulmón derecho desde la 3ra. costilla." },
					{ name: "Perro", diff: "40-45 anillos traqueales en forma de 'C', tiene una sección transversal prácticamente circular en sus extremos, su parte intermedia está aplanada dorsalmente." },
					{ name: "Cerdo", diff: "Longitud de 15-20 cm, 32-35 anillos traqueales y está algo deprimida en sentido dorsal exceptuando su porción terminal la cual es transversal circular." }
				]
			},
			pulmonIzquierdo: {
				label: "Pulmón Izquierdo",
				category: "Sistema Respiratorio",
				type: "vital",
				description:
					"Órganos que ocupan la mayor parte de la cavidad torácica, se adaptan a las paredes y órganos con los cuales limitan, siendo su función el intercambio de gases para la oxigenación del cuerpo.",
				facts: [
					{ label: "Tamaño", value: "Menor tamaño que el pulmón derecho" },
					{ label: "Color", value: "Varía según irrigación (normalmente rosado)" },
					{ label: "Función", value: "Intercambio de gases para oxigenación" },
				],
				subparts: [
					"Lóbulo craneal",
					"Lóbulo caudal",
					"Pleura visceral",
					"Bronquio principal izquierdo",
					"Bronquiolos",
					"Alvéolos",
					"Capilares pulmonares",
				],
				clinical:
					"Metástasis pulmonar: Los tumores metastásicos en los pulmones son cánceres que se desarrollan en otros lugares del cuerpo (u otras partes de los pulmones). Luego se propagan a través del torrente sanguíneo o el sistema linfático a los pulmones. Es diferente al cáncer pulmonar que comienza en los pulmones.",
				species: [
					{ name: "Caballo", diff: "Los pulmones no están divididos en lóbulos por cisuras como en la mayor parte de los mamíferos." },
					{ name: "Bovino", diff: "Los pulmones están divididos en lóbulos por cisuras profundas, el pulmón izquierdo se halla dividido en tres partes y están en contacto con el esófago." },
					{ name: "Cerdo", diff: "El lóbulo derecho está dividido en cuatro partes y el pulmón izquierdo puede considerarse conformado por dos o tres lóbulos." },
					{ name: "Perro", diff: "Difiere mucho de las otras especies ya que la forma es respecto a la cavidad torácica; la cara costal de estos es convexa por las paredes laterales que están incurvadas." }
				]
			},
			pulmonDerecho: {
				label: "Pulmón Derecho",
				category: "Sistema Respiratorio",
				type: "vital",
				description:
					"Órganos que ocupan la mayor parte de la cavidad torácica, se adaptan a las paredes y órganos con los cuales limitan, siendo su función el intercambio de gases para la oxigenación del cuerpo.",
				facts: [
					{ label: "Tamaño", value: "Mayor tamaño que el pulmón izquierdo" },
					{ label: "Color", value: "Varía según irrigación (normalmente rosado)" },
					{ label: "Función", value: "Intercambio de gases para oxigenación" },
				],
				subparts: [
					"Lóbulo craneal",
					"Lóbulo medio",
					"Lóbulo caudal",
					"Pleura visceral",
					"Bronquio principal derecho",
					"Bronquiolos",
					"Alvéolos",
				],
				clinical:
					"Metástasis pulmonar: Los tumores metastásicos en los pulmones son cánceres que se desarrollan en otros lugares del cuerpo (u otras partes de los pulmones). Luego se propagan a través del torrente sanguíneo o el sistema linfático a los pulmones. Es diferente al cáncer pulmonar que comienza en los pulmones.",
				species: [
					{ name: "Caballo", diff: "Los pulmones no están divididos en lóbulos por cisuras como en la mayor parte de los mamíferos." },
					{ name: "Bovino", diff: "Los pulmones están divididos en lóbulos por cisuras profundas, el pulmón izquierdo se halla dividido en tres partes y están en contacto con el esófago." },
					{ name: "Cerdo", diff: "El lóbulo derecho está dividido en cuatro partes y el pulmón izquierdo puede considerarse conformado por dos o tres lóbulos." },
					{ name: "Perro", diff: "Difiere mucho de las otras especies ya que la forma es respecto a la cavidad torácica; la cara costal de estos es convexa por las paredes laterales que están incurvadas." }
				]
			},
			intercambioGaseoso: {
				label: "Intercambio Gaseoso",
				category: "Fisiología Respiratoria",
				type: "system",
				description:
					"Proceso vital de difusión pasiva donde el O2 pasa a la sangre y el CO2 al alvéolo. En equinos, la barrera alvéolo-capilar es extremadamente delgada para permitir el alto rendimiento, pero esto la hace vulnerable a rupturas por presión sanguínea extrema.",
				facts: [
					{
						label: "Paso 1",
						value: "Llegada de aire a los alvéolos",
					},
					{ label: "Paso 2", value: "Difusión en red capilar" },
					{ label: "Paso 3", value: "Intercambio O2/CO2" },
					{ label: "Paso 4", value: "Transporte a tejidos" },
				],
				subparts: [
					"Membrana alvéolo-capilar",
					"Glóbulos rojos",
					"Hemoglobina",
					"Surfactante pulmonar",
				],
				clinical:
					"Acoplamiento Locomotor-Respiratorio: El caballo sincroniza una respiración por cada zancada en el galope. La ruptura de la barrera alvéolo-capilar por presiones de hasta 100 mmHg resulta en HPIE.",
			},
			alveolos: {
				label: "Alvéolos",
				category: "Unidad Funcional",
				type: "microstructure",
				description:
					"Sacos aéreos terminales del árbol bronquial. Son la unidad mínima de intercambio gaseoso. En el equino, presentan una gran capacidad de expansión y están más ramificados que en rumiantes, lo que soporta el ejercicio intenso.",
				facts: [
					{ label: "Diámetro", value: "0.2 - 0.5 mm" },
					{
						label: "Cantidad (Caballo)",
						value: "~480 - 500 millones",
					},
					{ label: "Superficie total", value: "~75 - 120 m²" },
					{
						label: "Comparativa",
						value: "Más pequeños y ramificados que en Bovinos",
					},
				],
				subparts: [
					"Neumocitos Tipo I (Intercambio)",
					"Neumocitos Tipo II (Surfactante)",
					"Macrófagos alveolares (Limpieza)",
					"Poros de Kohn (Comunicación)",
					"Tabique interalveolar",
					"Membrana respiratoria",
				],
				clinical:
					"Patologías clave: 1. Enfisema (Huélfago): Dificultad espiratoria y tos seca, común por heno enmohecido. 2. Atelectasia: Colapso por falta de expansión. 3. Edema: Líquido que impide la difusión de O2. Diagnóstico: Auscultación (murmullo vesicular vs estertores) y Percusión (sonido claro/resonante vs mate).",
			},
		},
	},
	bronquios: {
		id: "bronquios",
		label: "Bronquios",
		icon: "Bronq.",
		meshNames: ["bronquios"],
		hotspots: [
			{
				id: "bronq_principal",
				frac: [0.515, 0.606, 0.61],
				key: "arbolBronquial",
			},
		],
		data: {
			arbolBronquial: {
				label: "Árbol Bronquial",
				category: "Sistema Respiratorio",
				type: "system",
				description:
					"De la bifurcación de la tráquea se forman unos conductos fibrocartilaginosos conocidos como bronquios, estos se dividen en derecho e izquierdo y son los encargados de transportar el aire desde la tráquea hasta los pulmones.",
				facts: [
					{ label: "Composición", value: "Láminas cartilaginosas (en lugar de anillos)" },
					{ label: "Relación dorsal", value: "Arteria bronquial y ganglios linfáticos" },
					{ label: "Relación ventral", value: "Divisiones de la arteria pulmonar" },
				],
				subparts: [
					"Bronquio principal derecho",
					"Bronquio principal izquierdo",
					"Bronquios lobares",
					"Bronquios segmentarios",
					"Bronquiolos terminales",
					"Bronquiolos respiratorios",
					"Conductos alveolares",
				],
				clinical:
					"Diagnóstico de enfermedades respiratorias: los bronquios se estudian cuando un paciente presenta tos crónica, disnea y fatiga extrema, además si estos presentan inflamación de sus paredes (bronquitis) da como resultado una producción excesiva de mocos.",
				species: [
					{ name: "Caballo", diff: "El bronquio derecho es un poco de mayor tamaño que el izquierdo y su dirección es menos oblicua que la del izquierdo." },
					{ name: "Vaca", diff: "Tiene 3 bronquios principales, el bronquio para el lóbulo apical del pulmón derecho se desprende de la tráquea a nivel de la 3ra. costilla." },
					{ name: "Cerdo", diff: "Al igual que en la vaca, se desprende también un bronquio especial para el lóbulo apical del pulmón derecho." },
					{ name: "Perro", diff: "Los bronquios principales divergen en ángulo agudo y cada uno se divide en dos ramas antes de penetrar el pulmón, pero la ramificación difiere en los dos pulmones." }
				]
			},
		},
	},
	alveolo: {
		id: "alveolo",
		label: "Alveolo",
		icon: "Alv.",
		isSecondaryModel: true,
		hotspots: [
			{
				id: "alveolo_intercambio_gaseoso",
				frac: [0.418, 0.645, 0.829],
				key: "Intercambio gaseoso",
			},
		],
		data: {
			"Intercambio gaseoso": {
				label: "Intercambio Gaseoso",
				category: "Fisiología Alveolar",
				type: "system",
				description:
					"El intercambio gaseoso en los pulmones del equino es un proceso fisiológico vital y altamente eficiente, diseñado para soportar las altas demandas metabólicas del caballo, especialmente durante el ejercicio, donde pueden aumentar su consumo de oxígeno de manera exponencial.",
				facts: [
					{
						label: "Paso 1 Llegada del Aire",
						value: "El aire rico en oxígeno ingresa por las fosas nasales (son respiradores nasales obligados) y viaja por la tráquea, bronquios y bronquiolos hasta los alvéolos.",
					},
					{
						label: "Paso 2 Difusión Alveolar",
						value: "En los alvéolos, diminutos sacos aéreos rodeados por una densa red de capilares, ocurre la difusión pasiva.",
					},
					{
						label: "Paso 3 Oxígeno / CO2",
						value: "Debido a la alta concentración en el alvéolo y baja en la sangre, el oxígeno pasa a través de la membrana alvéolo-capilar (de una sola capa celular) hacia la sangre, uniéndose a la hemoglobina de los glóbulos rojos. El dióxido de carbono (desecho) presente en alta concentración en la sangre capilar pasa al alvéolo para ser exhalado.",
					},
					{
						label: "Paso 4 Transporte",
						value: "La sangre oxigenada regresa al corazón (aurícula y ventrículo izquierdos) para ser distribuida a los músculos y tejidos.",
					},
				],
				species: [
					{
						name: "Caballo",
						diff: "A diferencia de los rumiantes o carnívoros, el pulmón del equino tiene una lobulación externa muy poco marcada. Presenta ausencia de septos interlobulillares profundos, por lo que el parénquima es continuo; esto facilita una expansión uniforme pero permite la rápida propagación de infecciones. Posee un volumen pulmonar inmenso y una barrera alvéolo-capilar extremadamente delgada (vulnerable bajo estrés mecánico extremo).",
					},
					{
						name: "Bovino",
						diff: "Los pulmones están claramente divididos por tabiques (septos) profundos de tejido conectivo, marcando una lobulación externa muy evidente, lo que limita la propagación rápida de infecciones pero restringe la expansión uniforme.",
					},
					{
						name: "Otras Especies",
						diff: "Los rumiantes y carnívoros presentan divisiones lobulares bien definidas, a diferencia del parénquima continuo y uniforme del equino.",
					},
				],
				subparts: [
					"Membrana alvéolo-capilar",
					"Red de capilares",
					"Glóbulos rojos",
					"Hemoglobina",
					"Neumocitos Tipo I",
					"Neumocitos Tipo II",
				],
				clinical:
					"Hemorragia Pulmonar Inducida por el Ejercicio (HPIE): Debido a la altísima presión capilar que se genera durante el galope intenso, la barrera alvéolo-capilar puede romperse. Acoplamiento Locomotor-Respiratorio: El caballo es una de las pocas especies donde la respiración está rígidamente acoplada al ciclo de locomoción (en el galope, una respiración por cada zancada). La masa visceral empuja el diafragma hacia adelante y atrás como un pistón, lo que significa que el intercambio gaseoso depende directamente de la eficiencia de la zancada. Pleuritis y Efusión Pleural: Dada la posición del corazón y la profundidad del pecho (relevancia topográfica), el espacio pleural es vasto. La falta de lobulación marcada hace que las pleuropatías suelen ser difusas y graves, comprometiendo rápidamente la superficie de intercambio de ambos pulmones.",
			},
		},
	},
};
