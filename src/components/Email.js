import React from 'react';
import axios from 'axios';
import dateFns from 'date-fns';

class Email extends React.Component {
	constructor(){
        super();
        this.format = dateFns.format;
        this.today = dateFns.startOfToday();
        this.response = "";
        this.state = {
        	from: '2016-03-09',
        	to: this.format(this.today, 'YYYY-MM-DD'),
        	totalDebt: null,
        	totalIssues: null,
        	blocker: null,
        	critical: null,
        	major: null,
        	minor: null,
            blockerDiff: null,
        	criticalDiff: null,
        	majorDiff: null,
        	minorDiff: null
        };
    }

    convertMinToDays = (number) => Math.round(number / 60 / 24)

    // Sets color to red(negative), green(positive), or black(no change)
    determineStatusColor = (val) => {
        console.log(val);
        if(val < 0)
            return 'fontColor-success fontFamily-medium';
        if(val > 0)
            return 'fontColor-danger fontFamily-medium';

        return 'fontColor-black-30 fontFamily-medium';
    }

    // Build the JSON structure for the ScrollyCal data props
    buildStructure = (data, index) => {
        let date = this.format(data.d, 'MM-DD-YYYY'),
            elements = "",
            priorIndex = index !== 0 ? this.response[index - 1] : this.response[0],
            issuesThisDay = data.v[0] + data.v[1] + data.v[2] + data.v[3],
            issuesYesterday = priorIndex.v[0] + priorIndex.v[1] + priorIndex.v[2] + priorIndex.v[3],
            issuesDifference = issuesThisDay - issuesYesterday;
        // Set html
        elements = "<strong class=" + this.determineStatusColor(issuesDifference) + ">" + 
                issuesThisDay.toLocaleString() +
            "</strong>";
        return {
            [date]: elements
        }
    }

    // API may return data for the same day multiple times, check this
    removeDuplicateDates = (data, index) => {
        let date = this.format(data.d, 'MM-DD-YYYY'),
            priorIndex = index !== 0 ? this.response[index - 1] : this.response[0],
            priorDate = this.format(priorIndex.d, 'MM-DD-YYYY');
        // Check for date duplicate
        if(date !== priorDate){
            return true;
        }
    }

    // Parses the response into an object for the ScrollyCal component
    parseResponse = (response) => {
        // JSON structure
        // data = [{
        //          '12-10-31': '<span>....</span>'
        //      },
        //      ...
        // ]
        let data = {}
        this.response = response;
        data = response.filter(this.removeDuplicateDates).map(this.buildStructure);
    }

    sendReq = () => {
        const _this = this;
        axios.get(
                `http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=critical_violations,blocker_violations,major_violations,minor_violations,sqale_index,duplicated_lines&fromDateTime=${_this.state.from}T00:00&toDateTime=${_this.state.to}T23:59`,
                { withCredentials: false, crossDomain: true }
            )
            .then(
                response => {this.parseResponse(response.data[0].cells)}
            )
            .catch(function (error) {
                console.log("AXIOS ERROR: ", error);
            });
    }

    componentWillMount(){
        this.sendReq();
    }

    setFrom = (e) => {
    	this.setState({from: e.target.value});
        this.sendReq();
    }

    setTo = (e) => {
    	this.setState({to: e.target.value});
        this.sendReq();
    }

	render() {
        // console.log(dateFns);
        let prettyDate = (date) => dateFns.format(date, 'MM/DD/YYYY');
	    return (
	    	<div className="fontSize-4 padding-5">
                <h1 className="marginBottom-2">Qubicle Report</h1>
                <div className="grid marginBottom-2">
    		    	<label className="display-block textTransform-uppercase width-half paddingRight-1">
                        <span className="display-block marginBottom-1">From:</span>
                        <input
                            type="date"
                            onChange={this.setFrom}
                            defaultValue={this.state.from}
                            max={ this.state.to }
                            min='2016-03-09'
                        />
                    </label>
                    <label className="display-block textTransform-uppercase width-half paddingLeft-1">
                        <span className="display-block marginBottom-1">To:</span>
    		    	    <input
                            type="date"
                            onChange={this.setTo}
                            defaultValue={this.state.to}
                            max={ this.format(this.today, 'YYYY-MM-DD') }
                            min='2016-03-09'
                        />
                    </label>
                </div>
                <div className="padding-4 borderWidth-1 borderColor-white-20 bgColor-white-5 borderRadius-1">
                    <p>{ prettyDate(this.state.from) } – { prettyDate(this.state.to) }</p>
    				<p className="marginVertical-2 fontSize-5 fontColor-black-30">
                        {
                            this.state.totalIssues > 0
                            ? <span>{ this.state.totalIssues } issues added. </span>
                            : <span>{ Math.abs(this.state.totalIssues) } issues removed. </span>
                        }
                        {
                            this.state.duplicationsDiff > 0
                            ? <span>{ this.state.duplicationsDiff } duplicated lines added. </span>
                            : <span>{ Math.abs(this.state.duplicationsDiff) } duplicated lines removed. </span>
                        }
    				</p>
                    <ul className="lineHeight-6">
    					<li>
                            Blockers: { this.state.blocker } (<strong className={ this.determineStatusColor(this.state.blockerDiff) }>{ this.state.blockerDiff }</strong>)
                        </li>
    					<li>
                            Critical: { this.state.critical } (<strong className={ this.determineStatusColor(this.state.criticalDiff) }>{ this.state.criticalDiff }</strong>)
                        </li>
    					<li>
                            Major: { this.state.major } (<strong className={ this.determineStatusColor(this.state.majorDiff) }>{ this.state.majorDiff }</strong>)
                        </li>
    					<li>
                            Minor: { this.state.minor } (<strong className={ this.determineStatusColor(this.state.minorDiff) }>{ this.state.minorDiff }</strong>)
                        </li>
    				</ul>
                </div>
	    	</div>
	    )
	}
}

export default Email;
