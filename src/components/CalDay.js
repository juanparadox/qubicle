import React from 'react';

const CalDay = ({ children, onClick }) => (
    <div
        className="padding-1 borderWidth-1 borderColor-white-10 width-seventh textAlign-right"
        onClick={ onClick }
    >
        { children }
    </div>
)

export default CalDay;
