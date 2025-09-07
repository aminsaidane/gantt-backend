const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const mongoose = require('mongoose');


router.get('/', async (req,res)=>{
    const resources = await Resource.find(); 
    console.log(resources)
    res.status(201).json(resources);
})


module.exports= router