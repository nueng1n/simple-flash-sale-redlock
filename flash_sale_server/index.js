require('dotenv').config()

const express = require('express')
const Redis = require("ioredis");
const { v4: uuidv4 } = require('uuid');


const redisClient = new Redis({
    port: 6379, // Redis port
    host: 'redis', // Redis host
    username: "default"
})


const redisClient_save = new Redis({
    port: 6379, // Redis port
    host: 'redis', // Redis host
    username: "default",
    db:1
})


const app = express()
const port = 3000

app.get('/status', (req, res) => {
    res.send('Running')
})

const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

async function simple_redlock(callBack) {
    const retryDelayMs = 100;
    let retries = 20;

    const token = uuidv4()
    const lockKey = "lock"

    while (retries >= 0) {
        retries--;

        const acquired = await redisClient.set(lockKey, token, 'NX', 'PX', 5000)
        if (!acquired) {

            await pause(retryDelayMs);
            continue;
        }

        try {
            const signal = { expired: false };
            setTimeout(() => {
                signal.expired = true;
            }, 5000);

            await callBack(signal);

        } finally {



            const script = `

                    if redis.call('GET', KEYS[1]) == ARGV[1] then
                        return redis.call('DEL', KEYS[1])
                    end
                `

            await redisClient.eval(
                script,
                1,
                lockKey,
                token
            )

            return 0


        }


    }



}




app.post('/addToCart', async function (req, res) {


    await simple_redlock((signal) => {

        const resource = "AppleAvailability";

        if (signal.expired) {
            throw new Error('Lock expired, cant write any more data');
        }

        redisClient.get(resource, async (err, reply) => {

            if (err) {
                throw err;
            } else {


                if (reply <= 0) {
                    res.send("Sorry, Apple are sold out.");
                } else {
                    redisClient.decr(resource, async (err) => {
                        if (err) {
                            throw err;
                        } else {

                            await redisClient_save.set(`tnx:${uuidv4()}`, 'Apple add to cart successfully!')

                            console.log(`Apple add to cart successfully! and available ${reply - 1}`);
                            res.send(`Apple add to cart successfully! and available ${reply - 1}`);
                        }
                    });
                }
            }
        });

    })




})



app.listen(port, () => {

    if (process.env.INIT_SET == 'TRUE') {

        redisClient.set('AppleAvailability', parseInt(process.env.INIT_NUM), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`AppleAvailability set to ${process.env.INIT_NUM}`);
            }
        });
    }


    console.log(`Example app listening on port ${port}`)
})
