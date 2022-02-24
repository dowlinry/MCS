const axios = require('axios');
const prompt = require('prompt');

var dailyCommits = []

function main(){
    prompt.start();
    prompt.get(['date'], function (err, result) {
        if(err){
            console.log(err);
            return 1;
        }
        else{
            let date = result.date;
            let commits = 0;

            axios.get('https://api.github.com/users/{userName}/events')
            .then(response => {
                let events = response.data;

                events.forEach(event => {
                    if(event.type === "PushEvent"){
                        if(event.created_at.includes(date)){
                            commits++;
                        }
                    }
                })

                dailyCommits[date] = commits
                console.log(dailyCommits)
            })
        }

    })
}

main();