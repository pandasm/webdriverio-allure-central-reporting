let xmlparser = require('xml2json')
let fs = require('fs')
const esconfig = require('./configurations/esconfig')
const http = require('http')

var filename = []

fs.readdirSync('./allure-reports/').forEach(file =>{
    if(file.includes('.xml'))
        filename.push(file)
})

for(var filecount=0;filecount<filename.length;filecount++){

    var xml = fs.readFileSync('./allure-reports/'+filename[filecount],'utf-8');
    var result = JSON.parse(xmlparser.toJson(xml))

    var testresult = {testcases : []}
    var dt = new Date()
    var rundate = dt.getDate().toString() + "-" + dt.getMonth().toString() + "-" + dt.getFullYear().toString()
    var runid = dt.getDate().toString() + dt.getMonth().toString() + dt.getFullYear().toString() + dt.getHours().toString() + dt.getMinutes().toString() + dt.getSeconds().toString() + dt.getMilliseconds().toString()

    testcase = result['ns2:test-suite']['test-cases']['test-case']

    if(testcase.length > 0)
    {
        for(var i=0;i<testcase.length;i++){
            starttime = testcase[i].start
            endtime = testcase[i].stop
            testname = testcase[i].name
            status = testcase[i].status
            browser = testcase[i]['parameters']['parameter'].value
            browserversion = testcase[i]['parameters']['parameter'].value
            errormessage = 'NA'

            if(typeof browser == 'undefined'){
                browser = 'NA'
                browserversion = 'NA'
            }
            else
                browser = browser.split('-')[0]
            
            if(status == 'broken')
                errormessage = testcase[i]['failure']['message'].split(',')[0]

            testresult.testcases.push({
                "runid" : runid,
                "rundate" : rundate,
                "starttime" : starttime,
                "endtime" : endtime,
                "testname" : testname,
                "browser" : browser,
                "browserversion" : browserversion,
                "status" : status,
                "errormessage" : errormessage 
            })
        }
    }else{
        starttime = testcase.start
            endtime = testcase.stop
            testname = testcase.name
            status = testcase.status
            browser = testcase['parameters']['parameter'].value
            browserversion = testcase['parameters']['parameter'].value
            errormessage = 'NA'

            if(typeof browser == 'undefined'){
                browser = 'NA'
                browserversion = 'NA'
            }
            else
                browser = browser.split('-')[0]

            if(status == 'broken')
                errormessage = testcase['failure']['message'].split(',')[0]

            testresult.testcases.push({
                "runid" : runid,
                "rundate" : rundate,
                "starttime" : starttime,
                "endtime" : endtime,
                "testname" : testname,
                "browser" : browser,
                "browserversion" : browserversion,
                "status" : status,
                "errormessage" : errormessage 
            })
    }

    // Posting it in Elastic Search
    const options = {
        hostname: esconfig.esip,
        port: esconfig.esport,
        path: '/'+esconfig.esindex+"/"+esconfig.reporttool,
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        }
    }

    // Set up the request
    var post_req = http.request(options, function(res) {
        res.setEncoding('utf8');
    });

    // post the data
    post_req.write(JSON.stringify(testresult));
    post_req.end();

    console.log('Result posted')
}