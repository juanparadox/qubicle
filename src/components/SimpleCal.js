import React from 'react';
import {
    differenceInCalendarWeeks,
    isEqual,
    isFuture,
    startOfWeek,
    startOfMonth,
    addWeeks,
    addDays,
    format
} from 'date-fns';

import CalDay from './CalDay';

const SimpleCal = ({ data, onDateClick, startDate, endDate, className, olderDate, newerDate }) => {
    let weeks = differenceInCalendarWeeks(startDate, endDate) + 1, // +1 to get current week
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
                dayIsSelected = isEqual(day, olderDate) || isEqual(day, newerDate),
                dayIsUnavailable = isFuture(day),
                dayHasData = (data && data[formattedDay]),
                classes = 'position-relative padding-1 borderRight-1 borderBottom-1 width-seventh height-13 fontFamily-book',
                cursor = 'cursor-pointer',
                border = 'borderColor-white-20',
                bg = 'bgColor-white';
            // determine cursor, borderColor, and bgColor
            if(dayIsUnavailable || !dayHasData){
                bg = 'bgColor-white-10';
                border = 'borderColor-white-20';
                cursor = 'cursor-notAllowed';
            }
            else if(dayIsStartOfMonth){
                bg = 'bgColor-white-5';
            }
            else if(dayIsSelected){
                bg = 'bgColor-black fontColor-white';
            }
            // join classes
            classes = [classes, bg, border, cursor].join(' ');
            // push CalDay to elements
            elements.push(
                <CalDay
                    key={i}
                    className={ classes }
                    onClick={ dayHasData && onDateClick.bind(this, formattedDay) }
                >
                    {// if start of the month, add month (MMM format, ex: 'Dec')
                        dayIsStartOfMonth &&
                        <span className="fontColor-primary fontFamily-medium fontSize-5">
                            { format(day, 'MMM ') }
                        </span>
                    }
                    {// add the day
                        format(day, 'D')
                    }
                    {// if we have data for this date...
                        (dayHasData !== undefined)
                        // insert data
                        && <p>{ data[formattedDay].elements }</p>
                    }
                </CalDay>
            )
        }
        return elements;
    }

    return (
        <div id="SimpleCal" className={ className }>
            <div className="width-whole">{
                drawWeeks(weeks, startOfFirstWeek)
            }</div>
        </div>
    )
}

export default SimpleCal;
