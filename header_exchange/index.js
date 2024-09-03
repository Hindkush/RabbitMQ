const amqp = require('amqplib')

const url = `amqp://guest:guest@127.0.0.1`

const exchange = 'my_header_exchange'

const queue = 'queue'


const msg1 = {header:{test:1}}
const msg2 = {header:{test:2}}

const sendMessage = async(exchange,route,msg)=>{
    try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel()
    
    await channel.assertExchange(exchange,'headers')

    await channel.publish(exchange,route,Buffer.from(msg))

    await channel.close()
    await connection.close()

    } catch (error) {
        console.log(error);
        
    }
    
}

const receiveMessage = async(queueName,headers)=>{
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel()

        await channel.assertQueue(queueName)

        await channel.bindQueue(queueName,exchange,'',headers)

        channel.consume(queueName,(msg)=>{
            
            console.log(`que===${queueName}  ${msg.content.toString()}`);

            channel.ack(msg)
        })
    } catch (error) {
        console.log(error);
        
    }
   
}


sendMessage(exchange,'header 1 {test:1}',msg1)
sendMessage(exchange,'header 2 {test:2}',msg2)

receiveMessage(queue,{test:1})
receiveMessage(queue,{test:2})