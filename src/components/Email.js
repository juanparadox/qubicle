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
        	minor: null
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
                    critical: dataFrom.v[0],
                    blocker: dataFrom.v[1],
                    major: dataFrom.v[2],
                    minor: dataFrom.v[3],
                    totalDebt: _this.convertMinToDays(dataFrom.v[4]),
                    totalIssues: (totalFrom - totalTo)
                });
            })
            .catch(function (error) {
                console.log("AXIOS ERROR: ", error);
            });
    }

    componentWillMount(){
        this.sendReq();
    	// Make a request for a user with a given ID
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
	    return (
	    	<div className="fontSize-4 paddingHorizontal-5">
		    	<label className="display-block textTransform-uppercase">
                    <span className="display-block marginBottom-1">From:</span>
                    <input type="date" onChange={this.setFrom} defaultValue={this.state.from}/>
                </label>
                <label className="display-block textTransform-uppercase">
                    <span className="display-block marginBottom-1">To:</span>
		    	    <input type="date" onChange={this.setTo} defaultValue={this.state.to}/>
                </label>
		    	<h1 className="marginBottom-2">SonarQube Status:</h1>
				<p className="marginVertical-2 fontSize-6 fontColor-black-20">
                    Technical debt is at { this.state.totalDebt } (0) days. {this.state.totalIssues} issues caught since { this.state.from }.
				</p>
                <ul className="lineHeight-6">
					<li>Blockers: {this.state.blocker} (0)</li>
					<li>Critical: {this.state.critical} (0)</li>
					<li>Major: {this.state.major} (0)</li>
					<li>Minor: {this.state.minor} (0)</li>
				</ul>
	    	</div>
	    )
	}
}

export default Email;
