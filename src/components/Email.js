import React from 'react';
import axios from 'axios';
import { format, startOfToday, subDays } from 'date-fns';

import SimpleCal from './SimpleCal';
import Summary from './Summary';
import CalDay from './CalDay';

class Email extends React.Component {
	constructor(){
        super();
        this.formatDate = date => format(date, 'YYYY-MM-DD');
        this.today = startOfToday(),
        this.lastWeek = subDays(this.today, 7);
        // this.response = "";
        this.state = {
        	dateA: this.formatDate(this.lastWeek),
        	dateB: this.formatDate(this.today),
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
        let date = this.formatDate(data.d, 'MM-DD-YYYY'),
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
        let date = this.formatDate(data.d, 'MM-DD-YYYY'),
            priorIndex = index !== 0 ? arr[index - 1] : arr[0],
            priorDate = this.formatDate(priorIndex.d, 'MM-DD-YYYY');
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

    // Parses the response into an object for the SimpleCal component
    parseResponse = (response) => {
        console.log('parseResponse');
        // JSON structure
        // data = [{
        //          '12-10-31': '<span>....</span>'
        //      },
        //      ...
        // ]
        let data = {};
        data = response.filter(this.removeDuplicateDates).map(this.buildStructure).reduce(this.reduceData);
        // this.setState({ data: data }, () => this.setIssueCounts(this.state.data));
        console.log(data);
        this.setState({ data: data });
    }

    sendReq = () => {
        const _this = this;
        const url = `http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=critical_violations,blocker_violations,major_violations,minor_violations,sqale_index,duplicated_lines&fromDateTime=2016-03-09T00:00&toDateTime=${
            _this.formatDate(_this.today)
        }T23:59`

        axios.get(url,{ withCredentials: false, crossDomain: true })
            .then(
                response => { this.parseResponse(response.data[0].cells) }
            )
            .catch(error => { console.error("AXIOS ERROR: ", error) });
    }

    componentWillMount(){
        this.sendReq();
    }

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
            <div className="position-absolute left-fourth width-three-fourths fontSize-1 bgColor-white-30">
                    <div className="grid">{
                        // loop through each day of the week
                        ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                            (day, i) => (
                                <CalDay
                                    key={i}
                                    className="paddingTop-2 paddingLeft-2 height-8 width-seventh fontFamily-bold fontSize-2 letterSpacing fontColor-white"
                                >
                                    { day }
                                </CalDay>
                            )
                        )
                    }</div>
                </div>
                <SimpleCal
                    className='paddingTop-8 paddingBottom-1 width-three-fourths height-100vh overflowY-scroll'
                    data={ this.state.data }
                    onDateClick={ this.handleDateClick }
                    startDate={ this.formatDate(this.today) }
                    endDate='2016-03-09'
                />
	    	</div>
	    )
	}
}

export default Email;
