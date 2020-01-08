const request = require('request');
const cheerio = require('cheerio');
const BASE = 'https://www.producthunt.com/time-travel/'

const getBatch = (href,date) =>{
    return new Promise(resolve => {
    let arr=[];
    request(href,(error,response,html) => {
        if(!error && response.statusCode == 200){
            const $ = cheerio.load(html);
            const names = $('.item_54fdd');
            const links = $('.link_523b9');
            names.each((i,el)=>{
                tmp = {};
                let tmpdate = new Date(date);
                tmpdate = tmpdate.getDate()+'/'+(tmpdate.getMonth()+1)+'/'+tmpdate.getFullYear();
                tmp['Date'] = tmpdate;
                tmp['Name'] = $(el).children('a').children('div').children('h3').text();
                tmp['Description'] = $(el).children('a').children('div').children('p').html();
                tmp['Link'] = href+'/'+$(links).get(i)['attribs']['href'];
                tmp['Upvotes'] = $(el).children('.voteButtonWrap_4c515').text();
                arr.push(tmp);
            });
            let subarr = arr.slice(0,10);
            resolve(subarr);
        }
    });
    });
}


const getData = async (start,end) => {
    let all_data = [];
    let start_date = start.getDate()+'-'+(start.getMonth()+1)+'-'+start.getFullYear()
    let end_date = end.getDate()+'-'+(end.getMonth()+1)+'-'+end.getFullYear()
    var loop = new Date(start);
    while(loop <= end){       
        let date = loop.getFullYear()+'/'+(loop.getMonth()+1)+'/'+loop.getDate();
        let href = BASE+date;
        let progress = document.getElementById('progressbar');
        let val = parseInt((((loop.getTime()-start.getTime())/(1000*60*60*24))/((end.getTime()-start.getTime())/(1000*60*60*24)))*100);
        progress.textContent = val;
        progress.style='width:'+val+'%';
        let batch = await getBatch(href,date);
        batch.forEach(element => {
            all_data.push(element);
        });
        var newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(newDate);
    }
    /*
    
    const createCsvWriter = require('csv-writer').createObjectCsvWriter;
    const csvWriter = createCsvWriter({
        path: start_date+'_'+end_date+'.csv',
        header: [
            {id: 'Date', title: 'Date'},
            {id: 'Name', title: 'Name'},
            {id: 'Description', title: 'Description'},
            {id: 'Link', title:'Link'},
            {id: 'Upvotes', title:'Upvotes'}
        ]
    });

    csvWriter.writeRecords(all_data)
        .then(() => {
            console.log('...Done');
        });
        */
        
    return all_data
}
const data = getData(start,end);

module.exports = { 
    getData
}