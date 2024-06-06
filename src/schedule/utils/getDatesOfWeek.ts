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
    return weekDates;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}