import React from 'react';

const CalDay = ({ children, onClick }) => (
    <div
        className="padding-2 borderWidth-1 borderColor-white-10 width-seventh"
        onClick={ onClick }
    >
        { children }
    </div>
)

export default CalDay;
