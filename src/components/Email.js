import React from 'react';
import axios from 'axios';
import dateFns from 'date-fns';

import SimpleCal from './SimpleCal';
import Summary from './Summary';

class Email extends React.Component {
	constructor(){
        super();
        this.format = dateFns.format;
        this.today = dateFns.startOfToday();
        // this.response = "";
        this.state = {
        	from: '2016-03-09',
        	to: this.format(this.today, 'YYYY-MM-DD'),
        	totalDebt: null,
        	totalIssues: null,
        	blocker: 20,
        	critical: 10,
        	major: 900,
        	minor: 9000,
            blockerDiff: null,
        	criticalDiff: null,
        	majorDiff: null,
        	minorDiff: null
        };
    }

    convertMinToDays = (number) => Math.round(number / 60 / 24)

    // Sets color to red(negative), green(positive), or black(no change)
    determineStatusColor = (val) => {
        // console.log(val);
        if(val < 0)
            return 'fontColor-success fontFamily-medium';
        if(val > 0)
            return 'fontColor-danger fontFamily-medium';

        return 'fontColor-black-30 fontFamily-medium';
    }

    // Build the JSON structure for the SimpleCal data props
    buildStructure = (data, index, arr) => {
        let date = this.format(data.d, 'MM-DD-YYYY'),
            elements = "",
            priorIndex = index !== 0 ? arr[index - 1] : arr[0],
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

    reduceData = (lastVal, currentVal) => {
        for (var property in currentVal) {
            if (currentVal.hasOwnProperty(property)) {
                lastVal[property] = currentVal[property];
            }
        }
        return lastVal;
    }

    // API may return data for the same day multiple times, check this
    removeDuplicateDates = (data, index, arr) => {
        let date = this.format(data.d, 'MM-DD-YYYY'),
            priorIndex = index !== 0 ? arr[index - 1] : arr[0],
            priorDate = this.format(priorIndex.d, 'MM-DD-YYYY');
        // Check for date duplicate
        if(date !== priorDate || index === 0){
            return true;
        }
    }

    // Finds closest date if today does not have any data to show a
    // default view
    findClosestDate = (today) => {

    }

    //TODO: Finish depending on new JSON structure
    // Gets issue counts
    setIssueCounts = (data) => {
        let todaysData = data[this.state.to];
        //console.log("HHH");
        console.log(this.state.to);
        if(data){
            if(todaysData){
                this.setState({
                    blocker: todaysData,
                    critical: todaysData,
                    major: todaysData,
                    minor: todaysData
                })
            } else {
                this.findClosestDate(this.state.to)
            }
        }
        // console.log(data);
        // console.log(data[this.state.to]);
    }

    // Parses the response into an object for the ScrollyCal component
    parseResponse = (response) => {
        // JSON structure
        // data = [{
        //          '12-10-31': '<span>....</span>'
        //      },
        //      ...
        // ]
        let data = {};
        data = response.filter(this.removeDuplicateDates).map(this.buildStructure).reduce(this.reduceData);
        // this.setState({ data: data }, () => this.setIssueCounts(this.state.data));
        this.setState({ data: data });
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

    // setFrom = (e) => {
    // 	this.setState({from: e.target.value});
    //     this.sendReq();
    // }
    //
    // setTo = (e) => {
    // 	this.setState({to: e.target.value});
    //     this.sendReq();
    // }

    handleDateClick = (event) => {
        console.log('handleDateClick', event);
    }

	render() {
	    return (
	    	<div className="fontSize-4 width-whole grid">
                <Summary
                    from={ this.state.from }
                    to={ this.state.to }
                    totalIssues={ this.state.totalIssues }
                    blocker={ this.state.blocker }
                    blockerDiff={ this.state.blockerDiff }
                    critical={ this.state.critical }
                    criticalDiff={ this.state.criticalDiff }
                    major={ this.state.major }
                    majorDiff={ this.state.majorDiff }
                    minor={ this.state.minor }
                    minorDiff={ this.state.minorDiff }
                />
                <SimpleCal
                    className='width-three-fourths paddingLeft-5 paddingVertical-6 height-100vh overflowY-scroll'
                    data={ this.state.data }
                    onDateClick={ this.handleDateClick }
                    startDate={ this.format(this.today, 'MM/DD/YYYY') }
                    endDate={ this.format('2016-03-09', 'MM/DD/YYYY') }
                />
	    	</div>
	    )
	}
}

export default Email;
