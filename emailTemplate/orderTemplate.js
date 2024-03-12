const orderSuccessEmail = (name,cartItems) =>{
    console.log("i ma in ordersuccesemail")
     const email = {
        body: {
            name,
            intro:"Your order has been placed successfully",
            table:{
                data:cartItems.map((item)=>{
                    return{
                        product:item.name,
                        price:item.price,
                        quantity:item.cartQuantity,
                        total : item.price*item.cartQuantity
                    }
                }),
                columns:{
                    customWidth:{
                        product:"40%",
                    }
                }
            },
            action: [
                {
                    instructions: 'You can check the status of your order and more in your dashboard:',
                    button: {
                        color: '#22BC66',
                        text: 'go to dashboar',
                        link: 'http://localhost:3000/shop'
                    }
                },
                
            ],
            outro:"we thanku for your purchase.",
        }
     }
     return email;
}


module.exports = {
    orderSuccessEmail
}