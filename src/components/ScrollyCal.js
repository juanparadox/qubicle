import React from 'react';
import {
    differenceInCalendarWeeks,
    isEqual,
    startOfWeek,
    startOfMonth,
    addWeeks,
    addDays,
    format
} from 'date-fns';

import CalDay from './CalDay';

const ScrollyCal = ({ data, onDateClick, startDate, endDate, className }) => {
    let weeks = differenceInCalendarWeeks(startDate, endDate),
        startOfFirstWeek = startOfWeek(endDate);

    function drawWeeks(count, fromDate){
        let elements = [],
            i = 0;
        for (i; i < count; i++) {
            let week = addWeeks(fromDate, i),
                startDay = startOfWeek(week);
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
                        isEqual(day, startOfMonth(day)) &&
                        <span className="fontColor-white-30 fontFamily-bold">
                            { format(day, 'MMM ') }
                        </span>
                    }
                    { format(day, 'D') }
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
                            (day, i) => (<CalDay key={i}>{ day }</CalDay>)
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
