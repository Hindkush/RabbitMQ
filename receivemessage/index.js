const amqp = require('amqplib')

const url = `amqp://guest:guest@127.0.0.1`;

const queue = 'nodequeue'

const receiveMessage = async()=>{
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel()

        await channel.assertQueue()

        channel.consume(queue,(msg)=>{
            console.log(`Message Recevied ${queue}:::${msg.content.toString()}`);
            channel.ack(msg)
        })
    } catch (error) {
        console.log(error);
        
    }
}

receiveMessage()