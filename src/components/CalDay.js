import React from 'react';

const CalDay = ({ children, onClick, style, className }) => (
    <div
        className={ className }
        onClick={ onClick }
        style={ style }
    >
        { children }
    </div>
)

export default CalDay;
