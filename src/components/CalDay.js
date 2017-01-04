import React from 'react';

const CalDay = ({ children, onClick, style, className }) => (
    <div
        className={
            "padding-1 borderWidth-1 borderColor-white-10 width-seventh height-13 " + className
        }
        onClick={ onClick }
        style={ style }
    >
        { children }
    </div>
)

export default CalDay;
