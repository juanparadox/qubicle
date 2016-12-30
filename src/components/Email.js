import React from 'react';
import axios from 'axios';
import dateFns from 'date-fns';

// console.log(dateFns);

class Email extends React.Component {
	constructor(){
        super();
        this.format = dateFns.format;
        this.today = dateFns.startOfToday();
        this.lastWeek = dateFns.subDays(this.today, 7);
        this.state = {
        	from: this.format(this.lastWeek, 'YYYY-MM-DD'),
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

    sendReq = () => {
        const _this = this;
        axios.get(
                `http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=critical_violations,blocker_violations,major_violations,minor_violations,sqale_index,duplicated_lines&fromDateTime=${_this.state.from}T00:00&toDateTime=${_this.state.to}T23:59`,
                { withCredentials: false, crossDomain: true }
            )
            .then(function (response) {
                let data = response.data[0].cells,
                    lastCell = data.length - 1,
                    dataFrom = data[0],
                    dataTo = data[lastCell],
                    totalFrom = dataFrom.v[0] + dataFrom.v[1] + dataFrom.v[2] + dataFrom.v[3],
                    totalTo = dataTo.v[0] + dataTo.v[1] + dataTo.v[2] + dataTo.v[3];

                _this.setState({
                    critical: dataTo.v[0],
                    blocker: dataTo.v[1],
                    major: dataTo.v[2],
                    minor: dataTo.v[3],
                    criticalDiff: dataTo.v[0] - dataFrom.v[0],
                    blockerDiff: dataTo.v[1] - dataFrom.v[1],
                    majorDiff: dataTo.v[2] - dataFrom.v[2],
                    minorDiff: dataTo.v[3] - dataFrom.v[3],
                    totalDebt: _this.convertMinToDays(dataFrom.v[4]),
                    totalIssues: (totalTo - totalFrom),
                    duplicationsDiff: (dataTo.v[5] - dataFrom.v[5])
                });
            })
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
        let prettyDate = (date) => dateFns.format(date, 'MM/DD/YYYY'),
            determineStatusColor = (val) => {
                if(val < 0)
                    return 'fontColor-success fontFamily-medium';
                if(val > 0)
                    return 'fontColor-danger fontFamily-medium';

                return 'fontColor-silver fontFamily-medium';
            }
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
                            Blockers: { this.state.blocker } (<strong className={ determineStatusColor(this.state.blockerDiff) }>{ this.state.blockerDiff }</strong>)
                        </li>
    					<li>
                            Critical: { this.state.critical } (<strong className={ determineStatusColor(this.state.criticalDiff) }>{ this.state.criticalDiff }</strong>)
                        </li>
    					<li>
                            Major: { this.state.major } (<strong className={ determineStatusColor(this.state.majorDiff) }>{ this.state.majorDiff }</strong>)
                        </li>
    					<li>
                            Minor: { this.state.minor } (<strong className={ determineStatusColor(this.state.minorDiff) }>{ this.state.minorDiff }</strong>)
                        </li>
    				</ul>
                </div>
	    	</div>
	    )
	}
}

export default Email;
