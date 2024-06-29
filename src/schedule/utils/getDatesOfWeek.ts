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
    const actualDate = new Date();

    // Obtener el número de semana y el año de la fecha actual y la proporcionada
    const [actualYear, actualWeek] = obtainYearWeek(actualDate);
    const [givenYear, givenWeek] = obtainYearWeek(inputDate);

    // Verificar si la fecha proporcionada es de la semana pasada
    if (givenYear < actualYear || 
        (givenYear === actualYear && givenWeek < actualWeek)) {
        return true;
    }
    
    return false;
}

function obtainYearWeek(date: Date): [number, number] {
    // Crear una fecha con el primer día del año actual
    const year = date.getUTCFullYear();
    const startYear = new Date(Date.UTC(year, 0, 1));
    // Calcular el día de la semana del primer día del año
    const dayInitialWeek = startYear.getUTCDay();

    // Calcular el día del año y la semana
    const dayOfYear = Math.floor((date.getTime() - startYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((dayOfYear + dayInitialWeek + 1) / 7);

    return [year, week];
}

export function getSundayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diffToSunday = dayOfWeek;
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - diffToSunday + 6);
    return sunday;
}

export function getMondayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const diffToSunday = dayOfWeek;
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - diffToSunday);
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

export function getDayOfWeek(inputDate: Date): string {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = inputDate.getUTCDay();

    return daysOfWeek[dayIndex];
}
