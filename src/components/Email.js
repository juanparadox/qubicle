import React from 'react';
import axios from 'axios';
import { format, startOfToday, subDays, isBefore } from 'date-fns';

import SimpleCal from './SimpleCal';
import Summary from './Summary';
import CalDay from './CalDay';

class Email extends React.Component {
	constructor(){
        super();
        this.today = startOfToday(),
        this.lastWeek = subDays(this.today, 7);
        // this.response = "";
        this.state = {
        	olderDate: this.lastWeek,
        	newerDate: this.today,
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

    componentWillMount(){
        this.sendReq();
    }

    componentDidMount(){
        let cal = document.getElementById('SimpleCal');
        cal.scrollTop = cal.scrollHeight;
    }

    // Sets color to red(negative), green(positive), or black(no change)
    determineStatusColor = (val) => {
        if(val < 0)
            return 'fontColor-success fontFamily-medium';
        if(val > 0)
            return 'fontColor-danger fontFamily-medium';

        return 'fontColor-black-30 fontFamily-medium';
    }

    // Build the JSON structure for the SimpleCal data props
    buildStructure = (data, index, arr) => {
        let date = format(data.d, 'MM-DD-YYYY'),
            priorIndex = index !== 0 ? arr[index - 1] : arr[0],
            issuesThisDay = data.v[0] + data.v[1] + data.v[2] + data.v[3],
            issuesYesterday = priorIndex.v[0] + priorIndex.v[1] + priorIndex.v[2] + priorIndex.v[3],
            issuesDifference = issuesThisDay - issuesYesterday;
        console.log('issuesThisDay', issuesThisDay === null);
        return {
            [date]: {
                elements: (
                    <strong className={ this.determineStatusColor(issuesDifference) }>
                        { (issuesThisDay !== null) && issuesThisDay.toLocaleString() }
                    </strong>
                ),
                totalIssues: issuesThisDay,
                blocker: data.v[0],
                critical: data.v[1],
                major: data.v[2],
                minor: data.v[3]
            }
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
        let date = format(data.d, 'MM-DD-YYYY'),
            priorIndex = index !== 0 ? arr[index - 1] : arr[0],
            priorDate = format(priorIndex.d, 'MM-DD-YYYY');
        // Check for date duplicate
        if(date !== priorDate || index === 0){
            return true;
        }
    }

    // Parses the response into an object for the SimpleCal component
    parseResponse = (response) => {
        let data = response.filter(this.removeDuplicateDates).map(this.buildStructure).reduce(this.reduceData);
        this.setState({ calData: data }, this.calculateDifferences);
    }

    sendReq = () => {
        const _this = this;
        const url = `http://localhost:4000/?resource=com.wyndhamvo.ui:CustomerUI&metrics=blocker_violations,critical_violations,major_violations,minor_violations,sqale_index,duplicated_lines&fromDateTime=2016-03-09T00:00&toDateTime=${
            format(_this.today, 'YYYY-MM-DD')
        }T23:59`

        axios.get(url,{ withCredentials: false, crossDomain: true })
            .then(
                response => { this.parseResponse(response.data[0].cells) }
            )
            .catch(
                error => { console.error("NETWORK ERROR: ", error) }
            );
    }

    calculateDifferences = () => {
        let data = this.state.calData,
            olderDate = data[format(this.state.olderDate, 'MM-DD-YYYY')],
            newerDate = data[format(this.state.newerDate, 'MM-DD-YYYY')],
            newState;
        // if we have data for olderDate and newerDate
        if(olderDate && newerDate){
            newState = {
            	totalIssues: newerDate.totalIssues,
            	blocker: newerDate.blocker,
            	critical: newerDate.critical,
            	major: newerDate.major,
            	minor: newerDate.minor,
                blockerDiff: newerDate.blocker - olderDate.blocker,
            	criticalDiff: newerDate.critical - olderDate.critical,
            	majorDiff: newerDate.major - olderDate.major,
            	minorDiff: newerDate.minor - olderDate.minor
            }
        }
        // else if we have no olderDate...
        else if(!olderDate && newerDate){
            newState = {
            	totalIssues: newerDate.totalIssues,
            	blocker: newerDate.blocker,
            	critical: newerDate.critical,
            	major: newerDate.major,
            	minor: newerDate.minor
            }
        }
        this.setState(newState)
    }

    handleDateClick = selectedDate => {
        let { olderDate, newerDate } = this.state,
            newState;
        // if there's already two dates...
        if(olderDate && newerDate){
            newState = {
                newerDate: selectedDate,
                olderDate: null
            };
        }
        // else if we have no olderDate...
        else if(!olderDate && newerDate){
            // if selectedDate is before newerDate...
            if(isBefore(selectedDate, newerDate)){
                newState = { olderDate: selectedDate }
            }
            else{
                newState = {
                    newerDate: selectedDate,
                    olderDate: newerDate
                }
            }
        }
        this.setState(newState, this.calculateDifferences);
    }

	render() {
	    return (
	    	<div className="fontSize-4 width-whole grid">
                <Summary
                    olderDate={ this.state.olderDate }
                    newerDate={ this.state.newerDate }
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
                                    className="paddingTop-2 paddingLeft-2 height-8 width-seventh fontFamily-bold fontSize-2 letterSpacing fontColor-white borderColor-white-20 borderRight-1"
                                >
                                    { day }
                                </CalDay>
                            )
                        )
                    }</div>
                </div>
                <SimpleCal
                    className='paddingTop-8 paddingBottom-1 width-three-fourths height-100vh overflowY-scroll'
                    data={ this.state.calData }
                    onDateClick={ this.handleDateClick }
                    startDate={ this.today }
                    endDate='2016-03-09'
                    olderDate={ this.state.olderDate }
                    newerDate={ this.state.newerDate }
                />
	    	</div>
	    )
	}
}

export default Email;
