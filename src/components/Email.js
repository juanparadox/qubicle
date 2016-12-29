import React, { Component } from 'react';
import axios from 'axios'

class Email extends React.Component {
	constructor(){
        super();
        this.state = {
        	from: null,
        	to: null,
        	totalDebt: null,
        	totalIssues: null,
        	blockers: null,
        	criticial: null,
        	major: null,
        	minor: null
        };
    }

    componentWillMount(){
    	// Make a request for a user with a given ID
		axios.get('http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=critical_violations,blocker_violations,major_violations,minor_violations,sqale_index&fromDateTime=2016-12-13T00:00&toDateTime=2016-12-21T23:59',
		{
			withCredentials: false,
			crossDomain: true
		})
		  .then(function (response) {
		    console.log("AXIOS RESPONSE: ", response);
		  })
		  .catch(function (error) {
		    console.log("AXIOS ERROR: ", error);
		  });
    }

    setFrom = (e) => {
    	this.setState({from: e.target.value})
    }

    setTo = (e) => {
    	this.setState({to: e.target.value})
    }

	render() {
	    return (
	    	<div>
		    	<input type="date" onChange={this.setFrom}/>
		    	<input type="date" onChange={this.setTo}/>
		    	SonarQube:
				Technical debt is at {this.state.totalDebt} (+5) days. {this.state.totalIssues} issues caught since 12/13.
				<ul>
					<li>Blockers: {this.state.blockers} (0)</li>
					<li>Critical: {this.state.critical} (0)</li>
					<li>Major: {this.state.major} (0)</li>
					<li>Minor: {this.state.minor} (0)</li>
				</ul>
		    	<p>{this.props.test}</p>
	    	</div>
	    )
	}
}

export default Email;
