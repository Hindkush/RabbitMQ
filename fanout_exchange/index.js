const amqp = require('amqplib')

const url = `amqp://guest:guest@127.0.0.1`

const exchange = `my_fanout_exchange`;

const queue1 = `queue1`;
const queue2 = `queue2`;


const sendMessage = async(exchange,msg)=>{
    try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel()
    
    await channel.assertExchange(exchange,'fanout')

    await channel.publish(exchange,'',Buffer.from(msg))
    console.log(`msg sent to exchange ${exchange}::${msg}`);
        
    await channel.close()
    await connection.close()

    } catch (error) {
        console.log(error);
        
    }
}


const receiveMessage = async(queueName)=>{
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel()

        await channel.assertQueue(queueName)

        await channel.bindQueue(queueName,exchange,'')

        channel.consume(queueName,(msg)=>{
            console.log(`que===${queueName}  ${msg.content.toString()}`);
            
            channel.ack(msg)
        })
    } catch (error) {
        console.log(error);
        
    }
   
}

sendMessage(exchange,'msg 1')
sendMessage(exchange,'msg 2')

receiveMessage(queue1)
receiveMessage(queue2)