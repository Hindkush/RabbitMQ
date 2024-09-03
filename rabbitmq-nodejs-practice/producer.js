require('dotenv').config();
const amqp = require('amqplib')

const sendMessage = async()=>{
    try {
        //create connection to a rabbit mq
        const conection = await amqp.connect(process.env.CONNECTION_URL);
        const channel = await conection.createChannel();

        //declare a queue
        const queue = `task_queue`;
        await channel.assertQueue(queue,{durable:true})

        //send message to queue
        const message = `Hello Suraj You created first connection`
        await channel.sendToQueue(queue,Buffer.from(message),{
            persistent:true,
        })

        console.log(`Sent : ${message}`);

        setTimeout(()=>{
            conection.close()
        },500)
        
    } catch (error) {
        console.error(`Error came while sending the msg ${error}`);           
    }
}
sendMessage()