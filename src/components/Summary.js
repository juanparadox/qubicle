import React from 'react';
import dateFns from 'date-fns';

let prettyDate = (date) => dateFns.format(date, 'MM/DD/YYYY');

const Summary = ({ from, to, totalIssues, blocker, critical, major, minor }) => (
	<div className='width-fourth height-100vh bgColor-ui-dark fontColor-white fontFamily-book'>
		<img className="height-13 padding-5" src="../img/qubicle_logo.svg"/>
		<p class="bgColor-white-30 padding-3"><strong>Date:</strong> { prettyDate(from) } & { prettyDate(to) }</p>
    	<div class="padding-5 bgColor-grey">
			<p className="marginVertical-2 fontSize-5 fontColor-black-30">
                {
                    totalIssues > 0
                    ? <span>{ totalIssues } issues added. </span>
                    : <span>{ Math.abs(totalIssues) } issues removed. </span>
                }
                {/*
                    duplicationsDiff > 0
                    ? <span>{ duplicationsDiff } duplicated lines added. </span>
                    : <span>{ Math.abs(duplicationsDiff) } duplicated lines removed. </span>
                */}
			</p>
			<ul className="lineHeight-6">
				<li>
                    <strong>Blocker:</strong> { blocker.toLocaleString() }
                </li>
				<li>
                    <strong>Critical:</strong> { critical.toLocaleString() }
                </li>
				<li>
                    <strong>Major:</strong> { major.toLocaleString() }
                </li>
				<li>
                    <strong>Minor:</strong> { minor.toLocaleString() }
                </li>
			</ul>
		</div>
		<div>
				{/*
		            <ul className="lineHeight-6">
						<li>
		                    Blockers: { blocker } (<strong className={ this.determineStatusColor(blockerDiff) }>{ blockerDiff }</strong>)
		                </li>
						<li>
		                    Critical: { critical } (<strong className={ this.determineStatusColor(criticalDiff) }>{ criticalDiff }</strong>)
		                </li>
						<li>
		                    Major: { major } (<strong className={ this.determineStatusColor(majorDiff) }>{ majorDiff }</strong>)
		                </li>
						<li>
		                    Minor: { minor } (<strong className={ this.determineStatusColor(minorDiff) }>{ minorDiff }</strong>)
		                </li>
					</ul>
				*/}
	    </div>
        <div class="display-inlineBlock verticalAlign-top paddingLeft-5">
			<button class="paddingHorizontal-2">COPY TO CLIPBOARD</button>
		</div>
	</div>
)

export default Summary;