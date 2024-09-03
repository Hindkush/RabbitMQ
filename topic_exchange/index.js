const amqp = require('amqplib')

const url = `amqp://guest:guest@127.0.0.1`

const exchange = 'my_topic_exchange'

const queue1 = 'queue1'
const queue2 = 'queue2'

const route1 = 'route 1'
const route2 = 'route 2'

const sendMessage = async(exchange,route,msg)=>{
    try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel()
    
    await channel.assertExchange(exchange,'topic')

    await channel.publish(exchange,route,Buffer.from(msg))

    await channel.close()
    await connection.close()

    } catch (error) {
        console.log(error);
        
    }
    
}

const receiveMessage = async(queueName,route)=>{
    try {
        const connection = await amqp.connect(url);
        const channel = await connection.createChannel()

        await channel.assertQueue(queueName)

        await channel.bindQueue(queueName,exchange,route)

        channel.consume(queueName,(msg)=>{
            
            console.log(`que===${queueName} ${route} ${msg.content.toString()}`);

            channel.ack(msg)
        })
    } catch (error) {
        console.log(error);
        
    }
   
}


sendMessage(exchange,route1,'info 1')
sendMessage(exchange,route1,'info 2')
sendMessage(exchange,route2,'err 1')
sendMessage(exchange,route2,'err 2')

receiveMessage(queue1,route1)
receiveMessage(queue2,route2)