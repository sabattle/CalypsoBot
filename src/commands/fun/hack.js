const Command = require('../Command.js');
const ms = require('ms');

module.exports = class HackCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'hack',
      usage: 'hack <user>',
      description: 'Hack your friends! Or your enemies...',
      type: client.types.FUN
    });
  }
  async run(msg, args) {

      if (!args[0]) return msg.channel.send("Woaaah slow down, who are we hacking?")
      
      const user = msg.mentions.members.first()
      let hacked;
      if (user) {hacked = user;}
         else {hacked = msg.args.args.join(' ');}

      const prompt = await msg.channel.send(`Hacking ${hacked.displayName} now...`);
      var ipaddress = ["121.4.6.18","172.12.0.8","139.6.0.9","172.16.8.0","184.7.32.1","171.18.6.3","167.10.43.1","198.16.1.4"]
    let ip = ipaddress[Math.floor(Math.random() * ipaddress.length)]

    var Listwords = ["reeeee","suck","fuck","bitch","lol","f","damnit","ass","butt","donkey","discord","money","wumpus","shit","dankmemer","calypso", "Anogh","Ishita"]
        let word = Listwords[Math.floor(Math.random() * Listwords.length)]

      
      let time = "3s"
      setTimeout(function (){
          prompt.edit(`Finding discord login...`)
          }, ms(time))
          
          let time1 = "6s"
          setTimeout(function (){
            prompt.edit(`Found:\n**Email**: \`${hacked.displayName}***@gmail.com\`\n**Password**: \`*******\``);
              }, ms(time1))      
    
              let time2 = "9s"
              setTimeout(function (){
                prompt.edit(`Fetching dms`);
                  }, ms(time2)) 

                  let time3 = "12s"
                  setTimeout(function (){
                    prompt.edit(`Listing most common words... ${word}**`);
                      }, ms(time3))         
                      
                      let time4 = "15s"
                      setTimeout(function (){
                        prompt.edit(`Injecting virus into discriminator`);
                          }, ms(time4))                   

                          let time5 = "18s"
                          setTimeout(function (){
                            prompt.edit('Virus injected');
                              }, ms(time5))                   

                              let time6 = "21s"
                              setTimeout(function (){
                                prompt.edit(`**Finding IP address**: ${ip}`);
                                  }, ms(time6))                   
            
                                  let time7 = "24s"
                                  setTimeout(function (){
                                    prompt.edit('Spamming email...');
                                      }, ms(time7))    

                                      let time8 = "27s"
                                      setTimeout(function (){
                                        prompt.edit('Selling data to facebook...');
                                          }, ms(time8)) 
                                          
                                          let time9 = "30s"
                                          setTimeout(function (){
                                            prompt.edit(`Finished hacking ${user ? hacked.displayName : hacked}`);
                                              }, ms(time9)) 
                                              
                                              let time10 = "33s"
                                              setTimeout(function (){
                                                prompt.edit(`The hack is complete.`);
                                                  }, ms(time10)) 
                                              
  }
};
  