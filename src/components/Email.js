import React from 'react';
import axios from 'axios';
import dateFns from 'date-fns';

// console.log(dateFns);

class Email extends React.Component {
	constructor(){
        super();
        let format = dateFns.format,
            today = dateFns.startOfToday(),
            lastWeek = dateFns.subDays(today, 7);
        this.state = {
        	from: format(lastWeek, 'YYYY-MM-DD'),
        	to: format(today, 'YYYY-MM-DD'),
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
                `http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=critical_violations,blocker_violations,major_violations,minor_violations,sqale_index&fromDateTime=${_this.state.from}T00:00&toDateTime=${_this.state.to}T23:59`,
                { withCredentials: false, crossDomain: true }
            )
            .then(function (response) {
                // console.log("AXIOS RESPONSE: ", response);
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
                    criticalDiff: dataFrom.v[0] - dataTo.v[0],
                    blockerDiff: dataFrom.v[1] - dataTo.v[1],
                    majorDiff: dataFrom.v[2] - dataTo.v[2],
                    minorDiff: dataFrom.v[3] - dataTo.v[3],
                    totalDebt: _this.convertMinToDays(dataTo.v[4]),
                    totalIssues: (totalFrom - totalTo)
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
                // value < 0 ? 'fontColor-danger' : 'fontColor-success';
                if(val < 0)
                    return 'fontColor-danger'
                if(val > 0)
                    return 'fontColor-success'
                return 'fontColor-silver'
            }
	    return (
	    	<div className="fontSize-4 padding-5">
                <h1 className="marginBottom-2">Qubicle Report</h1>
		    	<label className="display-block textTransform-uppercase">
                    <span className="display-block marginBottom-1">From:</span>
                    <input type="date" onChange={this.setFrom} defaultValue={this.state.from}  max={ this.state.from }/>
                </label>
                <label className="display-block textTransform-uppercase">
                    <span className="display-block marginBottom-1">To:</span>
		    	    <input type="date" onChange={this.setTo} defaultValue={this.state.to}/>
                </label>
				<p className="marginVertical-4 fontSize-6 fontColor-black-30">
                    {
                        this.state.totalIssues > 0
                        ? <span>{ this.state.totalIssues } issues added between </span>
                    : <span>{ Math.abs(this.state.totalIssues) } issues removed between </span>
                    }
                    { prettyDate(this.state.from) } – { prettyDate(this.state.to) }.
				</p>
                <ul className="lineHeight-6">
					<li className={ determineStatusColor(this.state.blockerDiff) }>
                        Blockers: { this.state.blocker } ({ this.state.blockerDiff })
                    </li>
					<li className={ determineStatusColor(this.state.blockerDiff) }>
                        Critical: { this.state.critical } ({ this.state.criticalDiff })
                    </li>
					<li className={ determineStatusColor(this.state.blockerDiff) }>
                        Major: { this.state.major } ({ this.state.majorDiff })
                    </li>
					<li className={ determineStatusColor(this.state.blockerDiff) }>
                        Minor: { this.state.minor } ({ this.state.minorDiff })
                    </li>
				</ul>
	    	</div>
	    )
	}
}

export default Email;
