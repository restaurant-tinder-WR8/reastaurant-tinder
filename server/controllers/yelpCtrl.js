require('dotenv').config()
const { BEARER_TOKEN } = process.env

const axios = require('axios')

module.exports = {
    getRestaurants: async (req, res) => {
        console.log(req.body)
        const { latitude, longitude } = req.body
        var config = {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        }
        const setUrl = `https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=restaurants`
        axios.get(`${setUrl}`, config)
            .then(restaurants => {
                res.status(200).send(restaurants.data.businesses)
            })
        // .catch(err =>
        //     console.log(err))
    }
}