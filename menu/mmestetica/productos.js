const MENU_DATA = [
    {
        categoria: "Faciales Estéticos",
        items: [
            { id: 1, nombre: "Limpieza Facial Profunda", precio: 25000, desc: "Extracción profunda y nutrición." },
            { id: 2, nombre: "Dermaplaning", precio: 25000, desc: "Exfoliación mecánica y retiro de vello fino." },
            { id: 3, nombre: "Facial Hidratante", precio: 20000, desc: "Recuperación de la humedad natural." },
            { id: 4, nombre: "Facial Purificante", precio: 20000, desc: "Limpieza para pieles grasas o con acné." },
            { id: 5, nombre: "Facial Despigmentante", precio: 30000, desc: "Tratamiento para unificar el tono y manchas." },
            { id: 6, nombre: "Facial Regenerante Hilos de Seda", precio: 30000, desc: "Efecto tensor y rejuvenecedor." },
            { id: 7, nombre: "Facial Antioxidante Vitamina C", precio: 35000, desc: "Aporta luminosidad y protege del daño solar." },
            { id: 8, nombre: "Facial Multivitamínico", precio: 30000, desc: "Nutrición intensa con vitaminas esenciales." },
            { id: 9, nombre: "Facial con Microagujas", precio: 35000, desc: "Inducción de colágeno para textura y cicatrices." },
            { id: 10, nombre: "Peeling", precio: 35000, desc: "Renovación celular química profunda." },
            { id: 11, nombre: "Hollywood Peel", precio: 35000, desc: "Tratamiento láser para piel de porcelana." },
            { id: 12, nombre: "Lifting Facial sin Cirugía", precio: 25000, desc: "Reafirmación inmediata con aparatología." },
            { id: 13, nombre: "Rejuvenecimiento Facial", precio: 38000, desc: "Tratamiento integral antiedad." },
            { id: 14, nombre: "Rejuvenecimiento contorno de ojos", precio: 20000, desc: "Específico para ojeras y líneas de expresión." }
        ]
    },
    {
        categoria: "Faciales Spa",
        items: [
            { id: 15, nombre: "Facial Holístico con Guasha", precio: 18000, desc: "Drenaje linfático y relajación." },
            { id: 16, nombre: "Facial Holístico con Gemas", precio: 20000, desc: "Equilibrio energético y frescura facial." },
            { id: 17, nombre: "Facial Egipcio", precio: 20000, desc: "Técnica ancestral de hidratación." },
            { id: 18, nombre: "Vinoterapia Facial", precio: 20000, desc: "Antioxidantes naturales de la uva." },
            { id: 19, nombre: "Chocolaterapia Facial", precio: 18000, desc: "Suavidad y nutrición con aroma a cacao." },
            { id: 20, nombre: "Facial de Oro", precio: 25000, desc: "Lujo, brillo y vitalidad inmediata." },
            { id: 21, nombre: "Facial de Miel y Yogurt", precio: 18000, desc: "Nutrición suave para pieles sensibles." }
        ]
    },
    {
        categoria: "Masajes Spa",
        items: [
            { id: 22, nombre: "Relajante completo", precio: 20000, desc: "60 minutos de desconexión corporal." },
            { id: 23, nombre: "Relajante espalda", precio: 12000, desc: "Enfoque en zonas de mayor tensión." },
            { id: 24, nombre: "Piedras calientes completo", precio: 25000, desc: "Calor terapéutico para relajar músculos." },
            { id: 25, nombre: "Piedras calientes espalda", precio: 15000, desc: "Alivio térmico localizado." },
            { id: 26, nombre: "Masaje con pindas completo", precio: 25000, desc: "Hierbas aromáticas y calor." },
            { id: 27, nombre: "Masaje con pindas espalda", precio: 15000, desc: "Terapia herbal en zona dorsal." },
            { id: 28, nombre: "Lomi-lomi espalda", precio: 15000, desc: "Técnica rítmica hawaiana." }
        ]
    },
    {
        categoria: "Exfoliaciones y Envolturas",
        items: [
            { id: 29, nombre: "Exfoliación Cuerpo completo", precio: 18000, desc: "Piel suave y libre de células muertas." },
            { id: 30, nombre: "Exfoliación Espalda (Chocolate / Coco)", precio: 10000, desc: "Suavidad localizada." },
            { id: 31, nombre: "Envoltura Cuerpo completo", precio: 25000, desc: "Hidratación y nutrición profunda." },
            { id: 32, nombre: "Envoltura Espalda (Yogurt / Chocolate)", precio: 15000, desc: "Tratamiento revitalizante localizado." },
            { id: 33, nombre: "Pedicure Spa", precio: 18000, desc: "Belleza y relajación para pies." },
            { id: 34, nombre: "Pedicure Piernas cansadas", precio: 20000, desc: "Masaje circulatorio y cuidado estético." }
        ]
    },
    {
        categoria: "Láser Facial (Paquete 12 Sesiones)",
        items: [
            { id: 35, nombre: "Láser: Labio superior", precio: 48000, desc: "12 sesiones garantizadas." },
            { id: 36, nombre: "Láser: Mentón y cuello", precio: 50000, desc: "12 sesiones garantizadas." },
            { id: 37, nombre: "Láser: Patillas", precio: 50000, desc: "12 sesiones garantizadas." },
            { id: 38, nombre: "Láser: Nariz", precio: 25000, desc: "12 sesiones garantizadas." },
            { id: 39, nombre: "Láser: Orejas", precio: 28000, desc: "12 sesiones garantizadas." },
            { id: 40, nombre: "Láser: Rostro completo", precio: 90000, desc: "12 sesiones garantizadas." }
        ]
    },
    {
        categoria: "Láser Corporal (Paquete 6 Sesiones)",
        items: [
            { id: 41, nombre: "Axilas (6 sesiones)", precio: 48000, desc: "Eliminación de vello permanente." },
            { id: 42, nombre: "Brazos (6 sesiones)", precio: 68000, desc: "Eliminación de vello permanente." },
            { id: 43, nombre: "Espalda (6 sesiones)", precio: 90000, desc: "Eliminación de vello permanente." },
            { id: 44, nombre: "Abdomen (6 sesiones)", precio: 50000, desc: "Eliminación de vello permanente." },
            { id: 45, nombre: "Glúteos (6 sesiones)", precio: 48000, desc: "Eliminación de vello permanente." },
            { id: 46, nombre: "Línea de bikini (6 sesiones)", precio: 40000, desc: "Eliminación de vello permanente." },
            { id: 47, nombre: "Bikini completo (6 sesiones)", precio: 90000, desc: "Eliminación de vello permanente." },
            { id: 48, nombre: "Pierna completa (6 sesiones)", precio: 120000, desc: "Eliminación de vello permanente." }
        ]
    },
    {
        categoria: "Láser Corporal (Paquete 12 Sesiones)",
        items: [
            { id: 49, nombre: "Axilas (12 sesiones)", precio: 70000, desc: "Máximo resultado definitivo." },
            { id: 50, nombre: "Brazos (12 sesiones)", precio: 85000, desc: "Máximo resultado definitivo." },
            { id: 51, nombre: "Espalda (12 sesiones)", precio: 140000, desc: "Máximo resultado definitivo." },
            { id: 52, nombre: "Abdomen (12 sesiones)", precio: 70000, desc: "Máximo resultado definitivo." },
            { id: 53, nombre: "Glúteos (12 sesiones)", precio: 68000, desc: "Máximo resultado definitivo." },
            { id: 54, nombre: "Línea de bikini (12 sesiones)", precio: 60000, desc: "Máximo resultado definitivo." },
            { id: 55, nombre: "Bikini completo (12 sesiones)", precio: 140000, desc: "Máximo resultado definitivo." },
            { id: 56, nombre: "Pierna completa (12 sesiones)", precio: 160000, desc: "Máximo resultado definitivo." }
        ]
    }
];
