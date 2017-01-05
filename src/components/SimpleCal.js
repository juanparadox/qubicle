import React from 'react';
import {
    differenceInCalendarWeeks,
    isEqual,
    isFuture,
    isPast,
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
                formattedDay = format(day, 'YYYY-MM-DD'),
                dayIsStartOfMonth = isEqual(day, startOfMonth(day)),
                dayIsSelected = isEqual(day, startDate) || isEqual(day, endDate),
                dayIsUnavailable = isFuture(day),
                dayHasData = (data && data[formattedDay]),
                classes = 'relative padding-1 borderWidth-1 width-seventh height-13 fontFamily-book',
                cursor = 'cursor-pointer',
                borderColor = 'borderColor-white-10',
                bgColor = 'bgColor-white';

            // determine cursor, borderColor, and bgColor
            if(dayIsUnavailable || !dayHasData){
                bgColor = 'bgColor-white-10';
                // borderColor = 'borderColor-white';
                cursor = 'cursor-notAllowed';
            }
            else if(dayIsStartOfMonth){
                bgColor = 'bgColor-white-5';
            }
            else if(dayIsSelected){
                borderColor = 'borderColor-ui-dark';
                bgColor = ' bgColor-ui-light';
            }

            classes = [classes, bgColor, borderColor, cursor].join(' ');

            elements.push(
                <CalDay
                    key={i}
                    className={ classes }
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
                        (dayHasData !== undefined)
                        // insert data
                        && <p dangerouslySetInnerHTML={ { __html: data[formattedDay]} }></p>
                    }
                </CalDay>
            )
        }
        return elements;
    }

    return (
        <div className={ className }>
            <div className="width-whole">{
                drawWeeks(weeks, startOfFirstWeek)
            }</div>
        </div>
    )
}

export default SimpleCal;
