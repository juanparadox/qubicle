import React from 'react';
import dateFns from 'date-fns';

class Summary extends React.Component {

	prettyDate = date => dateFns.format(date, 'MM/DD/YYYY');

	// Selects text and copies to clipboard
	selectText = () => {
		let range = document.createRange(),
			selection;

	    // Selects text
	    range.selectNodeContents(document.getElementById('summary'));
	    selection = window.getSelection();
	    selection.removeAllRanges();
	    selection.addRange(range);

	    // Copies text to clipboard
		document.execCommand('copy')
	}

	// TODO: Use method already created in Email component
	// Sets color to red(negative), green(positive), or black(no change)
    determineStatusColor = (val) => {
        if(val < 0)
            return 'fontColor-success fontFamily-medium';
        if(val > 0)
            return 'fontColor-danger fontFamily-medium';

        return 'fontColor-black-30 fontFamily-medium';
    }

	// Handles date rendering in case only one date is passed as props
	renderDate = () => this.props.olderDate && this.props.newerDate
        ? this.prettyDate(this.props.olderDate) + " & " + this.prettyDate(this.props.newerDate)
        : this.prettyDate(this.props.newerDate)

	// Handles whether or not the "issues added" should be shown or just "issues"
	renderIssueCount = () => this.props.totalIssues > 0 && this.props.newerDate ?
		(<div>
			<strong>Issues added: </strong>
			<span>{ this.props.totalIssues.toLocaleString() }</span>
		</div>) :
		(<div><strong>Issues: </strong><span>{ this.props.totalIssues.toLocaleString() }</span></div>)

	// Renders each issue count and (if applicable) the differences between dates
	renderIssues = () =>
		<ul className="lineHeight-6">
			<li>
                <strong>Blocker: </strong>
                { this.props.blocker.toLocaleString() }
                &nbsp;{ this.props.olderDate && <strong className={ this.determineStatusColor(this.props.blockerDiff) }>{ this.props.blockerDiff }</strong>}
            </li>
			<li>
                <strong>Critical: </strong>
                { this.props.critical.toLocaleString() }
                &nbsp;{ this.props.olderDate && <strong className={ this.determineStatusColor(this.props.criticalDiff) }>{ this.props.criticalDiff }</strong>}
            </li>
			<li>
                <strong>Major: </strong>
                { this.props.major.toLocaleString() }
                &nbsp;{ this.props.olderDate && <strong className={ this.determineStatusColor(this.props.majorDiff) }>{ this.props.majorDiff }</strong>}
            </li>
			<li>
                <strong>Minor: </strong>
                { this.props.minor.toLocaleString() }
                &nbsp;{ this.props.olderDate && <strong className={ this.determineStatusColor(this.props.minorDiff) }>{ this.props.minorDiff }</strong>}
            </li>
		</ul>

	render() {
	    return (
	    	<div className='width-fourth height-100vh bgColor-ui-dark fontFamily-book'>
				<img className="height-13 padding-5" src="../img/qubicle_logo.svg" role="presentation"/>
				<p class="bgColor-white-5 padding-5 margin-5">
					<strong>Date: </strong>
					{ this.renderDate() }
				</p>
				{this.props.totalIssues &&
			    	<div id="summary" class="padding-5 bgColor-white-10 marginHorizontal-5" contentEditable>
						<p className="marginBottom-2 fontSize-5 fontColor-black">
							{ this.renderIssueCount() }
						</p>
						{ this.renderIssues() }
					</div>
				}
		        <div class="display-inlineBlock verticalAlign-top paddingLeft-5">
					<button class="paddingHorizontal-2" onClick={ this.selectText }>COPY TO CLIPBOARD</button>
				</div>
			</div>

	    )
	}
}

export default Summary;
