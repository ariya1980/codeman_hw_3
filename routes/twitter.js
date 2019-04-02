const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const router = express.Router()
const currentUser = require('../models/currentUser')
const tweetModel = require('../models/tweetModel')
const { Tweets , Users , connect } = require('../models/tweetDBModel')

const urlencodedParser = bodyParser.urlencoded({extended: true})

connect()

router.get('/users/login',function(request,response){
    response.render('my/login')
})

router.post('/users/session',urlencodedParser,async function(request,response){
    const { username, password } = request.body
    console.log("############# user : " +  username)
    currentUser.set(username)
    console.log("############# user : " +  currentUser.get())
    //find user password
    const user = await Users.findOne({where: {username:username,password:password}})
    console.log("############# user : " +  user)
    console.log("############# user : " + JSON.stringify(user, null, 4))
    if( typeof(user) !== undefined && user.username == username){
        response.redirect(`/twitter/tweets`)
    }else{
        response.redirect(`/twitter/users/login`)
    }
 })

 router.get('/users/sign_up',function(request,response){
    console.log("############ sign up ")
    response.render('my/signup')
})

router.post('/users',urlencodedParser,async function(request,response){
    console.log("############ create user")
    const { username, password } = request.body
    console.log("############ user : " + username + " password : " + password)
    await Users.create({username:username,password:password})
    response.render('my/login')
 })


router.get('/tweets',async function(request,response){
    console.log("############# tweets : " )
    const user = currentUser.get()
    //const tweets  = tweetModel.find(user)
    const tweets = await Tweets.findAll({where:{username:user}})
    console.log("############# tweets : " + JSON.stringify(tweets, null, 4))
    response.render('my/search',{tweets})
}).post('/tweets',urlencodedParser,async function(request,response){
    console.log("############ New")
    const { tweetData } = request.body
    const user = currentUser.get()
    //tweetModel.add(user,tweetData)
    await Tweets.create({tweet:tweetData,username:user})
    response.redirect(`/twitter/tweets/${user}`)
})

router.post('/search',urlencodedParser,async function(request,response){
    console.log("############search")
    const { q } = request.body
    console.log("############search : " + q)
    //const tweets  = tweetModel.findTweet(q)
    const tweets = await Tweets.findAll({where:{tweet:q}})
    if( typeof(tweets) !== undefined){
        console.log("############my search : " + JSON.stringify(tweets, null, 4))
        response.render('my/search',{tweets})
    }else{
        response.redirect('/twitter/tweets') 
    }
 })

router.get('/tweets/:id/:index',async function(request,response){
    const { id , index } = request.params
    console.log("############# tweets by id : "  + index)
    //const tweets  = tweetModel.findOne(id,index)
    const tweets = await Tweets.findByPk(index)
    response.render('my/show',{tweets})
})

router.get('/tweets/:id',async function(request,response){
    const { id } = request.params
    console.log("############# tweets by id : "  + id)
    //const tweets  = tweetModel.find(id)
    const tweets = await Tweets.findAll({where:{username:id}})
    response.render('my/search',{tweets})
})

router.get('/tweets/check/:id/:index',function(request,response){
    console.log("CHECK ############# ")
    const { id,index } = request.params
    console.log("CHECK ############# tweets by id : "  + id)
    console.log("CHECK ############# tweets by index : "  + index)
    const user = currentUser.get()
    if(user === id){
        //page edit
        response.redirect(`/twitter/tweets/${id}/${index}/edit`) 
    }else{
        //page show
        response.redirect(`/twitter/tweets/${id}`) 
    }
})

router.get('/new',function(request,response){
   response.render('my/new')
})

router.get('/tweets/:id/:index/edit',async function(request,response){
    //edit  tweets
    const { id, index } = request.params
    //const tweets  = tweetModel.findOne(id,index)
    const tweets = await Tweets.findByPk(index)
    console.log("############my findByPk : " + JSON.stringify(tweets, null, 4))
    response.render('my/edit',{tweets,id,index})
})

router.put('/tweets/:id/:index',urlencodedParser,async function(request,response){
    console.log("PUT ############# ")
    const { id, index } = request.params
    const { tweetEdit } = request.body
    //tweetModel.edit(id,index,tweetEdit)
    await Tweets.update({tweet: tweetEdit},{where:{id: index}})
    response.redirect(`/twitter//tweets/${id}/${index}/edit`) 
})

router.delete('/tweets/:id/:index',urlencodedParser,async function(request,response){
    const { id, index } = request.params
    console.log("DELETE ############# : " + index)
    await Tweets.destroy({where: {id: index}})
    response.redirect(`/twitter/tweets/${id}`) 
})

module.exports = router