import { Schedule } from "src/schedule/entities/schedule.entity";
import { getMondayOfWeek } from "src/schedule/utils/getDatesOfWeek";

export function calculateWeeklyHours(schedules: Schedule[]): Map<number, Record<string, Record<string, number>>> {
    const weeklyWorkHoursMap = new Map<number, Record<string, Record<string, number>>>();
    //calcular horas trabajadas por semana por usuario
    //actualizar registros anteriores a la fecha actual que tengan flag, además crear los nuevos que tienen fecha de hoy
    schedules.forEach(schedule => {
        const user = schedule.idUser;
        const startHour = schedule.entered;
        const endHour = schedule.left; //puede ser null
        const actualDate = new Date(schedule.date);

        if (!weeklyWorkHoursMap.has(user)) {
            weeklyWorkHoursMap.set(user, {});
        }
        const userWeeklyHours = weeklyWorkHoursMap.get(user);
        const currentWeekStart = (getMondayOfWeek(actualDate)).toISOString().split('T')[0];
        const currentDateString = (actualDate).toISOString().split('T')[0];

        if (!userWeeklyHours[currentWeekStart]) {
            userWeeklyHours[currentWeekStart] = {};
        }

        let hoursWorked = 0
        if (endHour){
            //calcular las horas a partir de la resta 
            const [startHours, startMinutes] = startHour.split(':').map(Number);
            const [endHours, endMinutes] = endHour.split(':').map(Number);
            const startTimeInMs = startHours * 60 * 60 * 1000 + startMinutes * 60 * 1000;
            const endTimeInMs = endHours * 60 * 60 * 1000 + endMinutes * 60 * 1000;
            
            hoursWorked = (endTimeInMs - startTimeInMs) / (1000 * 60 * 60);
        }
    
        userWeeklyHours[currentWeekStart][currentDateString] = (userWeeklyHours[currentWeekStart][hoursWorked] || 0) + hoursWorked; //ver que pasa si borro + hoursWorked
    });

    return weeklyWorkHoursMap;
}
