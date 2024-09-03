const amqp = require('amqplib')

const url = `amqp://guest:guest@127.0.0.1`;

const queue = 'nodequeue'

const sendMessage = async(msg) =>{
try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel()

    await channel.assertQueue(queue)

    await channel.sendToQueue(queue,Buffer.from(msg));

    console.log(`Message sent %s${queue}:::msg ${msg}`);
    
} catch (error) {
    console.log(error);
    
}
} 


sendMessage('Hello World 1')