# simple-flash-sale-redlock

This repo show how to implement redlock for support flash sale with  Limited Quantity.

for my learning.

NOTE if u want to use in production USE "https://www.npmjs.com/package/redlock".

I start DOKCER COMPOSE with loadbalancing and u can see i provide num of Apple is 3 follow below image.

![image](https://user-images.githubusercontent.com/115057360/212621369-d176f0ed-6426-4d46-b594-b063bb0f3b53.png)

for test send requests i use artillery with config in name "artillery_send_req.yml". so you can run by this cmd "artillery run artillery_send_req.yml".

![image](https://user-images.githubusercontent.com/115057360/212621509-ef09c604-7d3a-4c22-85ad-b40d4d5e0ab9.png)

this image show log of request incoming.

![image](https://user-images.githubusercontent.com/115057360/212621606-a2363c97-90d2-47ee-a38b-2e0ddd5d55ea.png)

2 image below show value in redis for init(start) and end of add to cart.

![Screenshot from 2023-01-16 14-21-36](https://user-images.githubusercontent.com/115057360/212621634-804ba5d0-bf8c-400f-bc44-bc736e0d7ffd.png)
![Screenshot from 2023-01-16 14-24-44](https://user-images.githubusercontent.com/115057360/212621644-21c0737c-52be-4e55-8fcc-26d67ae77d8a.png)

and finally swicth db to 1 for see result it save it seem correctly just right.

![Screenshot from 2023-01-16 14-25-12](https://user-images.githubusercontent.com/115057360/212621650-096a14e4-871f-4a71-87b1-528e98d6bf14.png)
