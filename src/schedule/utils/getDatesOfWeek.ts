export function getDatesOfWeek(inputDate: Date): string[] {
    //const setInputDate = new Date(inputDate);
    const dayOfWeek = inputDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(inputDate);
    monday.setDate(inputDate.getDate() - diffToMonday);
    const weekDates = [];
    const currentDate = new Date(monday);

    while (currentDate <= inputDate) {
        weekDates.push(formatDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    const formattedInputDate = inputDate.toISOString().split('T')[0];
    weekDates.push(formattedInputDate);
    return weekDates;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function isLastWeek(inputDate: Date): boolean {
    const fechaActual = new Date();

    // Obtener el número de semana y el año de la fecha actual y la proporcionada
    const [añoActual, semanaActual] = obtainYearWeek(fechaActual);
    const [añoProporcionado, semanaProporcionada] = obtainYearWeek(inputDate);

    // Verificar si la fecha proporcionada es de la semana pasada
    if (añoProporcionado < añoActual || 
        (añoProporcionado === añoActual && semanaProporcionada < semanaActual)) {
        return true;
    }
    
    return false;
}

function obtainYearWeek(fecha: Date): [number, number] {
    const dia = fecha.getUTCDate();
    const mes = fecha.getUTCMonth();
    const año = fecha.getUTCFullYear();

    // Crear una fecha con el primer día del año actual
    const inicioAño = new Date(Date.UTC(año, 0, 1));
    // Calcular el día de la semana del primer día del año (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
    const diaSemanaInicioAño = inicioAño.getUTCDay();

    // Calcular el día del año (0 = 1 de Enero, ..., 365 = 31 de Diciembre)
    const diaDelAño = Math.floor((fecha.getTime() - inicioAño.getTime()) / (24 * 60 * 60 * 1000));

    // Calcular el número de semana (ISO 8601)
    const semana = Math.ceil((diaDelAño + diaSemanaInicioAño + 1) / 7);

    return [año, semana];
}

export function getSundayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diffToSunday = dayOfWeek;
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - diffToSunday + 6);
    return sunday;
}

export function getDatesInRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}
