require('dotenv').config();
const amqp = require('amqplib');

const receiveMessage = async ()=>{
try {
    //create connection to rabbit mq
    const connection = await amqp.connect(process.env.channel)
    const channel = await connection.createChannel();

    //decalre queue
    const queue = `task_queue`;
    await channel.assertQueue(queue,{durable:true})

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue,(msg)=>{
        if(msg){
            console.log(`Recevied :${msg.content.toString()}`);
            
        }
        channel.ack(msg);
    })

} catch (error) {
    console.error(`Error while receiving the message ${error}`);
}
}

receiveMessage();