/**
 * api.js
 *  Definition for the BCS (SER416) REST API
 * 
 * @author Joel Casteel
 * @version April2021
 * @copyright Joel Casteel, April 2021 (MIT)
 * 
 */

const express = require('express');
var router = express.Router();

var MUUID = require("uuid-mongodb").mode('relaxed');
var User = require('./schema/user');
var Event = require('./schema/event');
var Registration = require('./schema/registration');
var Service = require('./schema/service');

const auth = require('./auth/token');
const role = require('./auth/role');

/**
 * Event - GET
 */
router.get('/event', async (req, res) => {
    let params = new URLSearchParams(
        req.url.substr(
            req.url.indexOf('?') + 1
    ));

    let limit = 50;
    if(params.has('limit')) {
        let lim = parseInt(params.get('limit'));
        if(!isNaN(lim)) {
            limit=lim;
        }
    }

    let query = {};

    if(params.has('startDate')) {
        if(!('startDate' in query)) {
            query.startDate = {}
        }
        let date = Date.parse(params.get('startDate'));
        console.log(date);
        if(!isNaN(date)) {
            query.startDate["$gte"] = date;
        }
    }

    if(params.has('endDate')) {
        if(!('startDate' in query)) {
            query.startDate = {}
        }
        let date = Date.parse(params.get('endDate'));
        console.log(date);
        if(!isNaN(date)) {
            query.startDate["$lte"] = date;
        }
    }

    if(params.has('title')) {
        query.title = {
            "$regex": params.get('title'),
            "$options": "i"
        };
    }

    let sortBy = 'desc'
    if(params.has('sortBy')) {
        if(params.get('sortBy') === 'asc') {
            sortBy = 'asc';
        }
    }

    try {
        let result = await Event.find(query).sort({'startDate': sortBy}).limit(limit);

        if(result != null) {
            let events = [];
            for(let i in result) {
                events.push(result[i].toJSON());
            }

            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(events));
        }

        return res.status(404).send('No events found');

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error Retrieving events");

    }

});


/**
 * Event - GET with UUID
 */
router.get('/event/:uuid', async (req, res) => {
    try {
        const uuid = MUUID.from(req.params.uuid);

        let event = await Event.findOne({'_uuid':uuid});

        if(event != null) {
            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(event));
        }

        return res.status(404).send("Event not found");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error retrieving event");

    }
});

/**
 * Event - POST
 */
router.post('/event', auth.checkToken, role.checkAdmin, async(req, res) => {
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);

    let conflict = null;

    try {
        conflict = await Event.findOne({
            'startDate': {
                '$lte': endDate,
            },
            'endDate': {
                '$gte': startDate,
            }
        });

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error checking event schedule");

    }

    if(conflict != null) {
        return res.status(409).send('Schedule Conflict: ' + conflict.title);
    }

    if(req.body.repeat) {

    }
    let plannerName = "";
    try {
        let planner = await User.findOne({'username': req.username});
        plannerName = planner.fullName;


    } catch(error) {
        console.log(error);
        return res.status(500).send("Error setting event author");

    }

    let event = new Event({
        'title': req.body.title,
        'description': req.body.description,
        'startDate': new Date(req.body.startDate),
        'endDate': req.body.endDate,
        'maxSlots': parseInt(req.body.maxSlots),
        'cost': parseFloat(req.body.cost),
        'planner': plannerName
    });

    try {
        let newEvent = await event.save();
        return res.status(201)
            .set({'Location':'/api/event/' + newEvent._uuid })
            .send('Event saved successfully');

    } catch(error) {
        console.log(error);
        res.status(500).send("Error saving event");
    }

});

/**
 * Event - DELETE
 */
router.delete('/event/:uuid', auth.checkToken, role.checkAdmin, async(req, res) => {
    try {
        const uuid = MUUID.from(req.params.uuid);

        await Registration.deleteMany({
            'eventID': uuid
        });

        await Event.deleteOne({'_uuid':uuid});

        res.status(204).send("Event and registrations deleted.");


    } catch(error) {
        console.log(error);
        res.status(500).send("Error deleting event.");

    }
});

router.get('/service', async(req, res) => {
    try {
        let result = await Service.find({});
        console.log(result);

        if(result != null) {
            let services = [];
            for(let i in result) {
                services.push(result[i].toJSON());
            }

            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(services));
        }

        return res.status(404).send('No services found');


    } catch(error) {
        console.log(error);
        res.status(500).send("Error finding services.");

    }
});

router.post('/service', auth.checkToken, role.checkAdmin, async(req, res) => {
    try {

        let service = new Service({
            "title": req.body.title,
            "description": req.body.description,
            "type": req.body.type,
            "cost": parseFloat(req.body.cost),
            "costPeriod": req.body.costPeriod
        });
        let newService = service.save();

        return res.status(201).send("success");


    } catch(error) {
        console.log(error);
        res.status(500).send("Error saving services.");
    }
});

/**
 * Event - GET with UUID
 */
router.get('/service/:uuid', async (req, res) => {
    try {
        const uuid = MUUID.from(req.params.uuid);

        let service = await Service.findOne({'_uuid':uuid});

        if(service != null) {
            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(service));
        }

        return res.status(404).send("Event not found");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error retrieving event");

    }
});

router.post('/sub', auth.checkToken, async (req, res) => {
    console.log(req.body);
    if(!('serviceID' in req.body)) {
        return res.status(400).send("Missing values");
    }

    let cardNumber = "";
    if('cardNumber' in req.body) {
        cardNumber = req.body.cardNumber;
    }

    try {
        const uuid = MUUID.from(req.body.serviceID);
        let service = await Service.findOne({'_uuid': uuid});
        if(service != null) {
                
            let update = await service.update({
                "$push": { "regs" :{
                    'username': req.username,
                    'cardNum': cardNumber,
                    'detail': req.body.detail
                }}
            });

            if(update != null) {
                return res.status(201).send("Payment added successfully");
            }

            return res.status(500).send("Error adding payment");


        }
        return res.status(404).send("Could not find user payment methods");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error fetching payments");
    }
});



/**
 * Registration - GET
 */
router.get('/registration', auth.checkToken, async(req, res) => {
    let params = new URLSearchParams(
        req.url.substr(
            req.url.indexOf('?') + 1
    ));

    let limit = 50;
    if(params.has('limit')) {
        let lim = parseInt(params.get('limit'));
        if(!isNaN(lim)) {
            limit=lim;
        }
    }

    let query = {};

    if(params.has('username')) {
        query.username = params.get('username');
    }

    if(params.has('eventID')) {
        query.eventID = params.get('eventID');
    }

    try {
        let result = await Registration.find(query).limit(limit);

        if(result != null) {
            let subs = [];
            for(let i in result) {
                subs.push(result[i].toJSON());
            }

            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(subs));
        }

        return res.status(404).send('No registrations found');

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error searching subscriptions");

    }
});

/**
 * Registration - GET
 */
router.get('/registration/:uuid', auth.checkToken, async(req, res) => {
    const uuid = MUUID.from(req.params.uuid);
    try {
        let reg = Registration.findOne({'_uuid': uuid});
        if(reg != null) {
            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(reg));
        }

        return res.status(404).send("No registration found with that ID");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error finding registration");

    }

});

/**
 * Registration - POST
 */
router.post('/reg', auth.checkToken, async(req, res) => {
    console.log(req.body);
    if(!('eventID' in req.body)) {
        return res.status(400).send("Missing values");
    }

    let cardNumber = "";
    if('cardNumber' in req.body) {
        cardNumber = req.body.cardNumber;

    }

    try {
        const uuid = MUUID.from(req.body.eventID);
        let event = await Event.findOne({'_uuid': uuid});
        if(event != null) {

            if(event.count < event.maxSlots ){
                
            let update = await event.update({
                "$push": { "regs" :{
                    'username': req.username,
                    'cardNum': cardNumber
                }},
                "$set": {
                    'count': event.count+1
                }
            });

            if(update != null) {
                return res.status(201).send("Payment added successfully");
            }

            return res.status(500).send("Error adding payment");

        }

        return res.status(409).send("Event at max capacity");

        }
        return res.status(404).send("Could not find user payment methods");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error fetching payments");
    }



});

/**
 * Registration - POST
 */
router.post('/registration', auth.checkToken, async(req, res) => {
    if(!('username' in req.body) || !('eventID' in req.body)) {
        return res.status(400).send("Missing values");
    }

    let cardNumber = 0;
    if('cardNumber' in req.body) {
        cardNumber.parseInt(req.body.cardNumber);

        if(isNaN(cardNumber)) {
            return res.status(400).send("Invalid card number");

        }

    }

    //Add subscriptions to the event
    //let event = await Event.findOne({'_uuid':req.body.eventID});

    let reg = new Registration({
        'username': req.body.username,
        'eventID': req.body.eventID,
        'cardNumber': cardNumber
    });

    try {
        let newReg = await reg.save();
        return res.status(201)
            .set({'Location':'/api/registration/' + newReg._uuid })
            .send('Registation saved successfully');

        


    } catch(error) {
        console.log(error);
        res.status(500).send("Error saving registration");

    }



});

/**
 * Registration - DELETE
 */
router.delete('/registration/:uuid', auth.checkToken, async(req, res) => {
    const uuid = MUUID.from(req.params.uuid);
    try {
        
        await Registration.deleteOne({'_uuid':uuid});

        res.status(204).send("Registrations deleted.");


    } catch(error) {
        console.log(error);
        res.status(500).send("Error deleting registration.");

    }

});

router.get('/payment', auth.checkToken, async(req, res) => {
    try {
        let user = await User.findOne({'username': req.username});
        if(user != null) {
            return res.status(200).set({'Content-Type': 'application/json'}).send(JSON.stringify(user.payment));

        }
        return res.status(404).send("Could not find user payment methods");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error fetching payments");
    }
});

router.post('/payment', auth.checkToken, async(req, res) => {
    if(!('cardNum' in req.body) || !('name' in req.body) || !('expirMonth' in req.body) || !('expirYear' in req.body)) {
        return res.status(400).send('Missing payment info');
    }

    try {
        let user = await User.findOne({'username': req.username});
        if(user != null) {
            user.payment.push({
                'cardNum': req.body.cardNum,
                'name': req.body.name,
                'expirMonth': req.body.expirMonth,
                'expirYear': req.body.expirYear
            });

            let update = await user.save();
            if(update != null) {
                return res.status(201).send("Payment added successfully");
            }

            return res.status(500).send("Error adding payment");

        }
        return res.status(404).send("Could not find user payment methods");

    } catch(error) {
        console.log(error);
        return res.status(500).send("Error fetching payments");
    }
});

router.get('/check', auth.checkToken, (req, res) => {
    return res.status(200).send("signed in");
})

module.exports = router;
