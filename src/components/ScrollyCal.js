import React from 'react';
import {
    differenceInCalendarWeeks,
    isEqual,
    startOfWeek,
    startOfMonth,
    endOfWeek,
    subWeeks,
    addWeeks,
    subDays,
    addDays,
    format
} from 'date-fns';

import CalDay from './CalDay';

const ScrollyCal = ({ data, onDateClick, startDate, endDate, className }) => {
    let weeks = differenceInCalendarWeeks(startDate, endDate),
        startOfFirstWeek = startOfWeek(endDate),
        endOfLastWeek = endOfWeek(startDate);

    function drawWeeks(count, fromDate){
        let elements = [],
            i = 0;
        for (i; i < count; i++) {
            let week = addWeeks(fromDate, i),
                startDay = startOfWeek(week),
                endDay = endOfWeek(week),
                day = 0;
            elements.push(
                <div className="grid" key={i}>
                    { drawDays(7, startDay) }
                </div>
            )
        }
        return elements;
    }

    function drawDays(count, fromDate){
        let elements = [],
            i = 0;
        for (i; i < count; i++) {
            let day = addDays(fromDate, i);
            elements.push(
                <CalDay key={i}>
                    {
                        isEqual(day, startOfMonth(day))
                        ? format(day, 'MMM D')
                        : format(day, 'D')
                    }
                </CalDay>
            )
        }
        return elements;
    }

    return (
        <div className={ className }>
            <div className="width-whole">
                <div className="fontSize-1 grid">
                    {
                        ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                            day => (<CalDay>{ day }</CalDay>)
                        )
                    }
                </div>
                {
                    drawWeeks(weeks, startOfFirstWeek)
                }
            </div>
        </div>
    )
}

export default ScrollyCal;
