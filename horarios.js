function obtenerBadgeEstado(n) {
    if (!n.estado_horario) return '';

    const ahora = new Date();
    const diaActual = ahora.getDay(); 
    const horaActual = ahora.getHours() + (ahora.getMinutes() / 60);

    // --- CASO: CITA O RESERVA ---
    if (n.estado_horario.tipo === 'cita' || n.estado_horario.tipo === 'reserva') {
        const texto = n.estado_horario.tipo === 'cita' ? 'Previa Cita' : 'Bajo Reserva';
        return `<div class="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl border border-blue-500/50 px-3 py-1.5 shadow-lg">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    <span class="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">${texto}</span>
                </div>`;
    }

    // --- CASO: HORARIO ---
    if (n.estado_horario.tipo === 'horario') {
        const config = n.estado_horario.config;
        const rangoHoy = config[diaActual];

        if (rangoHoy) {
            const [hInicio, mInicio] = rangoHoy[0].split(':').map(Number);
            const [hFin, mFin] = rangoHoy[1].split(':').map(Number);
            const inicio = hInicio + (mInicio / 60);
            const fin = hFin + (mFin / 60);

            if (horaActual >= inicio && horaActual < fin) {
                const minRestantes = (fin - horaActual) * 60;

                // CIERRA PRONTO (Menos de 30 min)
                if (minRestantes <= 30) {
                    return `<div class="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl border border-orange-500/50 px-3 py-1.5 shadow-lg">
                                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                <span class="text-orange-400 text-[9px] font-black uppercase tracking-[0.2em]">Cierra Pronto</span>
                            </div>`;
                }

                // ABIERTO NORMAL
                return `<div class="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-xl border border-emerald-500/50 px-3 py-1.5 shadow-lg">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span class="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">Abierto Ahora</span>
                        </div>`;
            }
        }

        // CERRADO: Buscar cuándo abre
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        let proximoDia = null;
        let diaEncontrado = "";

        for (let i = 1; i <= 7; i++) {
            let indexBusqueda = (diaActual + i) % 7;
            if (config[indexBusqueda]) {
                proximoDia = config[indexBusqueda];
                diaEncontrado = (i === 1) ? "Mañana" : diasSemana[indexBusqueda];
                break;
            }
        }

        const infoAbre = proximoDia ? `<span class="text-[#d4a373] text-[9px] font-bold uppercase tracking-tight">Abre ${diaEncontrado} a las ${proximoDia[0]}</span>` : '';

        return `<div class="absolute top-4 right-4 z-20 flex flex-col items-end gap-1 bg-black/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 shadow-xl">
                    <div class="flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                        <span class="text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em]">Cerrado</span>
                    </div>
                    ${infoAbre}
                </div>`;
    }
    return '';
}
