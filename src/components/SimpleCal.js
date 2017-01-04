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

const SimpleCal = ({ data, onDateClick, startDate, endDate, className }) => {
    // console.log('SimpleCal', data);
    let weeks = differenceInCalendarWeeks(startDate, endDate) + 1,
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
            let day = addDays(fromDate, i),
                formattedDay = format(day, 'MM-DD-YYYY'),
                dayIsStartOfMonth = isEqual(day, startOfMonth(day)),
                dayIsSelected = isEqual(day, startDate) || isEqual(day, endDate),
                classes = '';

            if(dayIsSelected){
                classes += 'bgColor-ui-light borderColor-ui-dark';
            }
            else if (dayIsStartOfMonth) {
                classes += 'bgColor-white-10';
            }

            elements.push(
                <CalDay
                    key={i}
                    className={classes}
                    onClick={ onDateClick.bind(this, formattedDay) }
                >
                    {// if start of the month, add month (MMM format, ex: 'Dec')
                        dayIsStartOfMonth &&
                        <span className="fontColor-primary fontFamily-medium">
                            { format(day, 'MMM ') }
                        </span>
                    }
                    {// add the day
                        format(day, 'D')
                    }
                    {// if we have data for this date...
                        (data && data[formattedDay] !== undefined)
                        // insert data
                        ? <p dangerouslySetInnerHTML={ { __html: data[formattedDay]} }></p>
                        // insert placeholder
                        : <p className="fontColor-white-30">–</p>
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

export default SimpleCal;
